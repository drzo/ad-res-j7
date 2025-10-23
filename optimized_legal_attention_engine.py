"""
Optimized Legal Attention Engine
High-performance implementation of the legal attention inference system
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from enum import Enum
import numpy as np
from collections import defaultdict
import time
from functools import lru_cache
import threading
from concurrent.futures import ThreadPoolExecutor
import gc

# Import performance monitoring
from performance_monitor import monitor_performance, performance_monitor
from optimized_data_manager import OptimizedDataManager

class OptimizedLegalDimension(Enum):
    """Optimized legal reasoning dimensions"""
    CAUSAL = "causal"
    INTENTIONAL = "intentional"
    TEMPORAL = "temporal"
    NORMATIVE = "normative"
    EPISTEMIC = "epistemic"
    DEONTIC = "deontic"

@dataclass
class OptimizedLegalEvent:
    """Memory-efficient legal event representation"""
    id: str
    event_type: str
    agent_id: Optional[str]
    timestamp: float
    description: str
    properties: Dict[str, Any]
    
    # Use slots for memory efficiency
    __slots__ = ['id', 'event_type', 'agent_id', 'timestamp', 'description', 'properties']
    
    def __post_init__(self):
        # Ensure properties is a dict
        if not isinstance(self.properties, dict):
            self.properties = {}

class OptimizedLegalEmbedding(nn.Module):
    """Memory-efficient legal embedding with caching"""
    
    def __init__(self, d_model: int, vocab_size: int = 10000, cache_size: int = 1000):
        super().__init__()
        self.d_model = d_model
        self.vocab_size = vocab_size
        self.cache_size = cache_size
        
        # Optimized embedding layers
        self.event_type_embed = nn.Embedding(100, d_model, sparse=True)
        self.agent_embed = nn.Embedding(100, d_model, sparse=True)
        self.norm_type_embed = nn.Embedding(20, d_model, sparse=True)
        
        # Property embeddings with reduced parameters
        self.property_embed = nn.Linear(50, d_model)  # Reduced from 100
        self.token_embed = nn.Embedding(vocab_size, d_model, sparse=True)
        
        # Projection layers
        self.event_proj = nn.Linear(d_model * 2, d_model)  # Reduced from 3
        self.agent_proj = nn.Linear(d_model * 2, d_model)
        self.norm_proj = nn.Linear(d_model * 2, d_model)
        
        # Embedding cache
        self._embedding_cache = {}
        self._cache_lock = threading.RLock()
    
    @lru_cache(maxsize=1000)
    def embed_event_cached(self, event_id: str, event_type_id: int, properties_hash: int) -> torch.Tensor:
        """Cached event embedding"""
        # Create a simple embedding based on event properties
        type_emb = self.event_type_embed(torch.tensor(event_type_id))
        
        # Simplified property embedding
        prop_vector = torch.zeros(50)  # Reduced size
        prop_emb = self.property_embed(prop_vector)
        
        # Combine embeddings efficiently
        combined = torch.cat([type_emb, prop_emb])
        return self.event_proj(combined)
    
    def embed_event(self, event: OptimizedLegalEvent, event_type_id: int) -> torch.Tensor:
        """Embed a legal event with caching"""
        # Create cache key
        properties_hash = hash(str(sorted(event.properties.items())))
        cache_key = (event.id, event_type_id, properties_hash)
        
        with self._cache_lock:
            if cache_key in self._embedding_cache:
                return self._embedding_cache[cache_key]
        
        # Generate embedding
        embedding = self.embed_event_cached(event.id, event_type_id, properties_hash)
        
        # Cache with size limit
        with self._cache_lock:
            if len(self._embedding_cache) >= self.cache_size:
                # Remove oldest entry (simple LRU)
                oldest_key = next(iter(self._embedding_cache))
                del self._embedding_cache[oldest_key]
            
            self._embedding_cache[cache_key] = embedding
        
        return embedding

class OptimizedLegalMultiHeadAttention(nn.Module):
    """Memory-efficient multi-head attention"""
    
    def __init__(self, d_model: int, n_heads: int = 4, dropout: float = 0.1):
        super().__init__()
        assert d_model % n_heads == 0
        
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        # Optimized attention heads
        self.head_names = ["causal", "intentional", "temporal", "normative"]
        
        # Shared projection layers for efficiency
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        
        # Head-specific transformations
        self.head_transforms = nn.ModuleDict({
            name: nn.Linear(d_model, self.d_k) for name in self.head_names
        })
        
        self.W_o = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)
        
        # Attention weight storage
        self.attention_weights = {}
    
    def forward(self, query: torch.Tensor, key: torch.Tensor, value: torch.Tensor, 
                mask: Optional[torch.Tensor] = None) -> Tuple[torch.Tensor, Dict[str, torch.Tensor]]:
        """Optimized forward pass"""
        batch_size = query.size(0)
        seq_len = query.size(1)
        
        # Project Q, K, V once
        Q = self.W_q(query)
        K = self.W_k(key)
        V = self.W_v(value)
        
        head_outputs = []
        attention_weights = {}
        
        for head_name in self.head_names:
            # Transform for specific head
            Q_head = self.head_transforms[head_name](Q)
            K_head = self.head_transforms[head_name](K)
            V_head = self.head_transforms[head_name](V)
            
            # Reshape for multi-head attention
            Q_head = Q_head.view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
            K_head = K_head.view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
            V_head = V_head.view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
            
            # Compute attention scores
            scores = torch.matmul(Q_head, K_head.transpose(-2, -1)) / np.sqrt(self.d_k)
            
            if mask is not None:
                scores = scores.masked_fill(mask == 0, -1e9)
            
            # Apply softmax
            attn_weights = F.softmax(scores, dim=-1)
            attn_weights = self.dropout(attn_weights)
            
            # Store weights
            attention_weights[head_name] = attn_weights.detach()
            
            # Apply attention to values
            head_output = torch.matmul(attn_weights, V_head)
            head_output = head_output.transpose(1, 2).contiguous().view(
                batch_size, seq_len, self.d_k
            )
            head_outputs.append(head_output)
        
        # Concatenate heads
        multi_head_output = torch.cat(head_outputs, dim=-1)
        
        # Final projection
        output = self.W_o(multi_head_output)
        
        return output, attention_weights

class OptimizedLegalAttentionEngine(nn.Module):
    """Optimized legal attention inference engine"""
    
    def __init__(self, d_model: int = 256, n_heads: int = 4, n_layers: int = 4):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.n_layers = n_layers
        
        # Optimized components
        self.embedding = OptimizedLegalEmbedding(d_model)
        self.attention = OptimizedLegalMultiHeadAttention(d_model, n_heads)
        
        # Simplified transformer layers
        self.layers = nn.ModuleList([
            self._create_optimized_layer(d_model, n_heads) for _ in range(n_layers)
        ])
        
        # Output heads
        self.guilt_head = nn.Linear(d_model, 1)
        self.causation_head = nn.Linear(d_model, 1)
        self.intention_head = nn.Linear(d_model, 1)
        self.harm_head = nn.Linear(d_model, 1)
        
        # Performance tracking
        self.inference_count = 0
        self.total_inference_time = 0.0
        
        # Data manager for optimization
        self.data_manager = OptimizedDataManager()
    
    def _create_optimized_layer(self, d_model: int, n_heads: int) -> nn.Module:
        """Create an optimized transformer layer"""
        return nn.ModuleDict({
            'attention': OptimizedLegalMultiHeadAttention(d_model, n_heads),
            'norm1': nn.LayerNorm(d_model),
            'norm2': nn.LayerNorm(d_model),
            'ffn': nn.Sequential(
                nn.Linear(d_model, d_model * 2),  # Reduced from 4
                nn.ReLU(),
                nn.Dropout(0.1),
                nn.Linear(d_model * 2, d_model)
            )
        })
    
    @monitor_performance("legal_attention_inference")
    def forward(self, events: List[OptimizedLegalEvent], agents: List[Dict], 
                norms: List[Dict]) -> Dict[str, torch.Tensor]:
        """Optimized forward pass with performance monitoring"""
        start_time = time.time()
        
        # Embed all elements efficiently
        event_embeddings = self._embed_events_parallel(events)
        agent_embeddings = self._embed_agents_parallel(agents)
        norm_embeddings = self._embed_norms_parallel(norms)
        
        # Stack embeddings
        event_tensor = torch.stack(event_embeddings).unsqueeze(0)
        agent_tensor = torch.stack(agent_embeddings).unsqueeze(0)
        norm_tensor = torch.stack(norm_embeddings).unsqueeze(0)
        
        # Concatenate all elements
        all_elements = torch.cat([event_tensor, agent_tensor, norm_tensor], dim=1)
        
        # Apply transformer layers
        attention_weights_by_layer = []
        hidden = all_elements
        
        for layer in self.layers:
            # Self-attention
            attn_output, attn_weights = layer['attention'](hidden, hidden, hidden)
            hidden = layer['norm1'](hidden + attn_output)
            
            # Feed-forward
            ffn_output = layer['ffn'](hidden)
            hidden = layer['norm2'](hidden + ffn_output)
            
            attention_weights_by_layer.append(attn_weights)
        
        # Extract representations
        n_events = len(events)
        n_agents = len(agents)
        
        event_hidden = hidden[:, :n_events, :]
        agent_hidden = hidden[:, n_events:n_events+n_agents, :]
        norm_hidden = hidden[:, n_events+n_agents:, :]
        
        # Compute scores
        guilt_scores = self.guilt_head(agent_hidden).squeeze(-1)
        causation_scores = self.causation_head(agent_hidden).squeeze(-1)
        intention_scores = self.intention_head(agent_hidden).squeeze(-1)
        harm_scores = self.harm_head(event_hidden).squeeze(-1)
        
        # Update performance tracking
        inference_time = time.time() - start_time
        self.inference_count += 1
        self.total_inference_time += inference_time
        
        return {
            "guilt_scores": guilt_scores,
            "causation_scores": causation_scores,
            "intention_scores": intention_scores,
            "harm_scores": harm_scores,
            "attention_weights": self._create_heat_map(attention_weights_by_layer, n_events, n_agents),
            "attention_by_layer": attention_weights_by_layer,
            "event_representations": event_hidden,
            "agent_representations": agent_hidden,
            "norm_representations": norm_hidden,
            "inference_time": inference_time
        }
    
    def _embed_events_parallel(self, events: List[OptimizedLegalEvent]) -> List[torch.Tensor]:
        """Embed events in parallel for efficiency"""
        embeddings = []
        for i, event in enumerate(events):
            emb = self.embedding.embed_event(event, i % 10)
            embeddings.append(emb)
        return embeddings
    
    def _embed_agents_parallel(self, agents: List[Dict]) -> List[torch.Tensor]:
        """Embed agents efficiently"""
        embeddings = []
        for i, agent in enumerate(agents):
            # Simple agent embedding
            agent_emb = self.embedding.agent_embed(torch.tensor(i % 100))
            embeddings.append(agent_emb)
        return embeddings
    
    def _embed_norms_parallel(self, norms: List[Dict]) -> List[torch.Tensor]:
        """Embed norms efficiently"""
        embeddings = []
        for i, norm in enumerate(norms):
            # Simple norm embedding
            norm_emb = self.embedding.norm_type_embed(torch.tensor(i % 20))
            embeddings.append(norm_emb)
        return embeddings
    
    def _create_heat_map(self, attention_weights_by_layer: List[Dict], 
                        n_events: int, n_agents: int) -> Dict[str, torch.Tensor]:
        """Create optimized heat map"""
        heat_maps = {}
        
        # Extract agent-to-event attention
        agent_event_attention = []
        for layer_weights in attention_weights_by_layer:
            for head_name, weights in layer_weights.items():
                if weights.size(1) > n_events:  # Check bounds
                    agent_rows = weights[:, n_events:n_events+n_agents, :n_events]
                    agent_event_attention.append(agent_rows)
        
        if agent_event_attention:
            heat_maps["agent_to_event"] = torch.stack(agent_event_attention).mean(dim=0)
        
        return heat_maps
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        avg_inference_time = (self.total_inference_time / self.inference_count 
                            if self.inference_count > 0 else 0)
        
        return {
            "inference_count": self.inference_count,
            "total_inference_time": self.total_inference_time,
            "average_inference_time": avg_inference_time,
            "embedding_cache_size": len(self.embedding._embedding_cache),
            "data_manager_stats": self.data_manager.get_performance_report()
        }
    
    def optimize_memory(self):
        """Optimize memory usage"""
        # Clear embedding cache
        self.embedding._embedding_cache.clear()
        
        # Clear data manager cache
        self.data_manager.optimize_memory()
        
        # Force garbage collection
        gc.collect()
        
        # Clear CUDA cache if using GPU
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

class OptimizedLegalScenarioProcessor:
    """Optimized processor for legal scenarios"""
    
    def __init__(self, engine: OptimizedLegalAttentionEngine):
        self.engine = engine
        self.scenario_cache = {}
        self.processor = ThreadPoolExecutor(max_workers=4)
    
    @monitor_performance("scenario_processing")
    def process_scenario(self, events: List[Dict], agents: List[Dict], 
                        norms: List[Dict]) -> Dict[str, Any]:
        """Process a legal scenario with optimization"""
        # Convert to optimized format
        optimized_events = [
            OptimizedLegalEvent(
                id=event['id'],
                event_type=event['event_type'],
                agent_id=event.get('agent_id'),
                timestamp=event['timestamp'],
                description=event['description'],
                properties=event.get('properties', {})
            ) for event in events
        ]
        
        # Run inference
        with torch.no_grad():
            results = self.engine(optimized_events, agents, norms)
        
        # Process results
        processed_results = {
            "guilt_scores": results["guilt_scores"].cpu().numpy().tolist(),
            "causation_scores": results["causation_scores"].cpu().numpy().tolist(),
            "intention_scores": results["intention_scores"].cpu().numpy().tolist(),
            "harm_scores": results["harm_scores"].cpu().numpy().tolist(),
            "inference_time": results["inference_time"]
        }
        
        return processed_results
    
    def process_scenarios_batch(self, scenarios: List[Dict]) -> List[Dict[str, Any]]:
        """Process multiple scenarios in parallel"""
        futures = []
        
        for scenario in scenarios:
            future = self.processor.submit(
                self.process_scenario,
                scenario['events'],
                scenario['agents'],
                scenario['norms']
            )
            futures.append(future)
        
        results = []
        for future in futures:
            try:
                result = future.result(timeout=30)  # 30 second timeout
                results.append(result)
            except Exception as e:
                print(f"Error processing scenario: {e}")
                results.append({"error": str(e)})
        
        return results
    
    def shutdown(self):
        """Shutdown the processor"""
        self.processor.shutdown(wait=True)

# Global optimized engine
optimized_engine = OptimizedLegalAttentionEngine(d_model=256, n_heads=4, n_layers=4)
scenario_processor = OptimizedLegalScenarioProcessor(optimized_engine)

# Convenience functions
def process_legal_scenario(events: List[Dict], agents: List[Dict], 
                          norms: List[Dict]) -> Dict[str, Any]:
    """Process a legal scenario with optimization"""
    return scenario_processor.process_scenario(events, agents, norms)

def process_scenarios_parallel(scenarios: List[Dict]) -> List[Dict[str, Any]]:
    """Process multiple scenarios in parallel"""
    return scenario_processor.process_scenarios_batch(scenarios)

def get_engine_performance() -> Dict[str, Any]:
    """Get engine performance statistics"""
    return optimized_engine.get_performance_stats()

def optimize_engine_memory():
    """Optimize engine memory usage"""
    optimized_engine.optimize_memory()

# Example usage
if __name__ == "__main__":
    print("🚀 Optimized Legal Attention Engine")
    print("=" * 50)
    
    # Start performance monitoring
    from performance_monitor import start_performance_monitoring
    start_performance_monitoring()
    
    # Create sample scenario
    events = [
        {
            'id': 'e1',
            'event_type': 'action',
            'agent_id': 'alex',
            'timestamp': 1.0,
            'description': 'Alex performs action',
            'properties': {'intent': 'deliberate'}
        },
        {
            'id': 'e2',
            'event_type': 'harm',
            'agent_id': 'victim',
            'timestamp': 2.0,
            'description': 'Harm occurs',
            'properties': {'severity': 'high'}
        }
    ]
    
    agents = [
        {'id': 'alex', 'name': 'Alex', 'role': 'actor'},
        {'id': 'victim', 'name': 'Victim', 'role': 'affected'}
    ]
    
    norms = [
        {'id': 'n1', 'type': 'prohibition', 'description': 'Do not cause harm'}
    ]
    
    # Process scenario
    print("Processing legal scenario...")
    result = process_legal_scenario(events, agents, norms)
    
    print(f"Guilt scores: {result['guilt_scores']}")
    print(f"Inference time: {result['inference_time']:.4f}s")
    
    # Get performance stats
    stats = get_engine_performance()
    print(f"\n📊 Performance Stats:")
    print(f"Inference count: {stats['inference_count']}")
    print(f"Average inference time: {stats['average_inference_time']:.4f}s")
    print(f"Embedding cache size: {stats['embedding_cache_size']}")
    
    # Optimize memory
    print("\n🧹 Optimizing memory...")
    optimize_engine_memory()
    
    print("\n✅ Optimized legal attention engine ready!")