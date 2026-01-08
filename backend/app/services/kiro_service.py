import subprocess
import re
import time
import logging
from pathlib import Path
from typing import Dict, Any, Optional

from app.models import ComparisonContext

logger = logging.getLogger(__name__)


class KiroService:
    """Service for interacting with Kiro CLI agent"""
    
    def __init__(self):
        self.agent_name = "tech-stack-referee"
        self.project_root = Path.cwd()
        self.timeout = 45  # seconds
        
    def check_kiro_cli(self) -> bool:
        """Check if Kiro CLI is installed and accessible"""
        try:
            result = subprocess.run(
                ["kiro-cli", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False
    
    def check_agent_config(self) -> bool:
        """Check if agent configuration exists"""
        print(f"checking agent configuration {self.project_root}")
        agent_config_path = self.project_root / ".kiro" / "agents" / "referee_agent.json"
        return agent_config_path.exists()
    
    def build_query(self, query: str, context: Optional[ComparisonContext] = None) -> str:
        """Build full query with context"""
        if not context:
            return query
        
        # Add context to query
        context_parts = []
        
        if context.use_case:
            if "for" not in query.lower():
                query += f" for {context.use_case}"
        
        if context.team_size:
            context_parts.append(f"team of {context.team_size}")
        
        if context.timeline:
            context_parts.append(f"timeline: {context.timeline}")
        
        if context.expertise:
            context_parts.append(f"expertise: {context.expertise}")
        
        if context.budget:
            context_parts.append(f"budget: {context.budget}")
        
        if context_parts:
            query += f", {', '.join(context_parts)}"
        
        return query
    
    def clean_output(self, output: str) -> str:
        """Clean ANSI codes and CLI formatting from output"""
        # Remove ANSI escape sequences
        clean = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', output)
        clean = re.sub(r'\x1b\([AB]', '', clean)
        
        # Remove CLI formatting
        clean = re.sub(r'╭[─┬╮]*╮.*?╰[─┴╯]*╯', '', clean, flags=re.DOTALL)
        clean = re.sub(r'Model:.*?\n', '', clean)
        clean = re.sub(r'Plan:.*?\n', '', clean)
        clean = re.sub(r'▸ Credits:.*?\n', '', clean)
        clean = re.sub(r'\[tech-stack-referee\].*?>', '', clean)
        clean = re.sub(r'> ', '', clean)
        
        # Clean up whitespace
        lines = clean.split('\n')
        cleaned_lines = [line.strip() for line in lines if line.strip()]
        
        return '\n\n'.join(cleaned_lines) if cleaned_lines else ""
    
    def call_agent(self, query: str) -> Dict[str, Any]:
        """
        Call Kiro CLI agent with the given query
        
        Args:
            query: The comparison query
            
        Returns:
            Dictionary with success status and response or error
        """
        start_time = time.time()
        
        try:
            logger.info(f"Calling Kiro CLI agent with query: {query}")
            
            # Call kiro-cli with no-interactive mode
            result = subprocess.run(
                ["kiro-cli", "chat", "--agent", self.agent_name, "--no-interactive", query],
                capture_output=True,
                text=True,
                cwd=str(self.project_root),
                timeout=self.timeout
            )
            
            execution_time = time.time() - start_time
            
            if result.returncode == 0:
                # Clean the output
                response = self.clean_output(result.stdout)
                
                if response:
                    logger.info(f"Agent call successful in {execution_time:.2f}s")
                    return {
                        "success": True,
                        "response": response,
                        "execution_time": execution_time
                    }
                else:
                    logger.error("Agent returned empty response")
                    return {
                        "success": False,
                        "error": "Agent returned empty response",
                        "execution_time": execution_time
                    }
            else:
                error_msg = result.stderr[:500] if result.stderr else "Unknown error"
                logger.error(f"Agent call failed: {error_msg}")
                return {
                    "success": False,
                    "error": error_msg,
                    "execution_time": execution_time
                }
                
        except subprocess.TimeoutExpired:
            execution_time = time.time() - start_time
            logger.error(f"Agent call timed out after {self.timeout}s")
            return {
                "success": False,
                "error": f"Request timed out after {self.timeout} seconds. Try a simpler query.",
                "execution_time": execution_time
            }
            
        except FileNotFoundError:
            logger.error("Kiro CLI not found")
            return {
                "success": False,
                "error": "Kiro CLI is not installed or not in PATH",
                "execution_time": time.time() - start_time
            }
            
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(f"Unexpected error: {str(e)}")
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}",
                "execution_time": execution_time
            }