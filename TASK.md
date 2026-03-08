# BrainForge AI/ML Section - Complete Overhaul

## Mission
Transform the AI/ML section from 60 basic quiz questions into the most comprehensive deep learning mastery platform. Scrape, process, and generate content from top research sources.

## Parse.bot API
- Endpoint: https://api.parse.bot/mcp
- API Key: pmx_e73a6668a0bb6635e6016fca3052f472
- Usage: POST to parse structured data from any URL

## Content Sources to Scrape

### 1. Meta AI Research
- URL: https://ai.meta.com/results/?content_types[0]=publication&research_areas[0]=computer-vision&research_areas[1]=robotics&research_areas[2]=systems-research&research_areas[3]=reinforcement-learning&research_areas[4]=core-machine-learning
- Extract: Paper titles, abstracts, links, research areas
- Focus: CV, robotics, RL, core ML papers

### 2. Karpathy/autoresearch
- URL: https://github.com/karpathy/autoresearch
- Extract: All components/building blocks of AI agents
- Generate: Explainers for GPT model architecture, transformers, hyperparameters, optimizers, batch size, learning rate, etc.
- Create: Coding challenges for each component

### 3. Karpathy Repos (ALL of them)
- URL: https://github.com/karpathy?tab=repositories
- Key repos: nanoGPT, minbpe, llm.c, micrograd, makemore, nn-zero-to-hero
- For EACH repo: Create step-by-step walkthrough (Step 1, Step 2, etc.) so user fully understands fundamentals
- Generate: Code explanations, quizzes, implementation challenges

### 4. DeepLearning.ai Courses
- URL: https://www.deeplearning.ai/courses/?courses_date_desc[refinementList][skill_level][0]=Intermediate
- URL: https://www.deeplearning.ai/short-courses/build-and-train-an-llm-with-jax/
- Extract: Course outlines, key concepts, learning objectives
- Generate: Equivalent quiz/explainer content

### 5. NVIDIA Research
- URL: https://research.nvidia.com/publications
- Extract: Recent ML publications, GPU optimization papers
- Focus: Training efficiency, inference optimization, scaling

### 6. DeepMind Research
- URL: https://deepmind.google/research/
- Extract: Key papers (AlphaFold, Gemini, etc.)
- Focus: RL, game playing, protein folding, reasoning

## Content Types to Generate Per Topic

Each topic should have ALL of these:
1. **Explainer** - Plain English breakdown with step-by-step progression
2. **Visual** - ASCII/text diagrams of architectures, data flow (we'll render them in the UI)
3. **Quiz** - Multiple choice (4 options) + explanation for correct answer
4. **Coding Challenge** - Implement the concept (with starter code + solution)
5. **Paper Walkthrough** - For research papers: section-by-section breakdown

## Curriculum Structure (Progression Path)

### Level 1: Foundations
- Linear algebra basics (vectors, matrices, dot products)
- Calculus for ML (gradients, chain rule, backprop math)
- Probability & statistics fundamentals
- Python for ML (numpy, tensors, autodiff)

### Level 2: Neural Network Fundamentals
- Perceptron → MLP → Deep networks
- Activation functions (ReLU, sigmoid, tanh, GELU)
- Loss functions (MSE, cross-entropy, contrastive)
- Backpropagation (implement from scratch - micrograd style)
- Optimizers (SGD, Adam, AdaGrad, learning rate schedules)
- Regularization (dropout, weight decay, batch norm)
- Hyperparameter tuning (grid search, random search, Bayesian)

### Level 3: Architectures
- CNNs (convolutions, pooling, ResNet, VGG)
- RNNs/LSTMs (sequence modeling, vanishing gradients)
- Transformers (attention is all you need - deep dive)
- Self-attention mechanism (implement from scratch)
- Positional encoding (sinusoidal, rotary, ALiBi)
- Multi-head attention

### Level 4: Language Models
- Tokenization (BPE, WordPiece, SentencePiece - minbpe walkthrough)
- GPT architecture (nanoGPT walkthrough)
- BERT, T5, encoder-decoder
- Training LLMs (pretraining, SFT, RLHF, DPO)
- Scaling laws (chinchilla, compute-optimal)
- Inference optimization (KV cache, speculative decoding, quantization)

### Level 5: Computer Vision
- Image classification, object detection
- Diffusion models (DDPM, stable diffusion)
- Vision transformers (ViT, DINO, SAM)
- Multimodal (CLIP, LLaVA, Flamingo)

### Level 6: Reinforcement Learning
- MDPs, value functions, policy gradient
- Q-learning, DQN, PPO, SAC
- RLHF for LLMs
- Multi-agent RL

### Level 7: Systems & Production
- Distributed training (data parallel, model parallel, pipeline parallel)
- GPU programming basics (CUDA concepts)
- Inference serving (vLLM, TensorRT, ONNX)
- MLOps (experiment tracking, model registry, deployment)

### Level 8: Research Frontier
- Latest papers from Meta, DeepMind, NVIDIA
- Paper reading skills (how to read ML papers)
- Reproducing paper results
- Contributing to open source ML

## Data Format

Keep the existing format but expand it:
```json
{
  "id": "ai-ml",
  "name": "AI/ML Research",
  "levels": {
    "foundations": {
      "name": "Foundations",
      "description": "...",
      "topics": [
        {
          "id": "topic-id",
          "title": "Backpropagation",
          "explainer": "Step-by-step explanation...",
          "visual": "ASCII diagram...",
          "questions": [...],
          "coding_challenge": {
            "prompt": "Implement backprop for a 2-layer MLP",
            "starter_code": "...",
            "solution": "...",
            "tests": "..."
          },
          "paper_ref": "optional link to relevant paper",
          "source": "karpathy/micrograd"
        }
      ]
    }
  }
}
```

## Scraping Strategy
1. Use web_fetch / curl for GitHub repos (raw content)
2. Use Parse.bot API for structured extraction from Meta AI, NVIDIA, DeepMind
3. Use web_fetch for DeepLearning.ai course pages
4. Process and generate content using Claude's knowledge + scraped data

## Output
- Update `/home/ubuntu/brainforge/data/ai-ml.json` with the new comprehensive curriculum
- Update the Next.js UI to support new content types (explainers, visuals, coding challenges)
- Build and verify locally before deploying

When completely finished, run this command to notify me:
openclaw system event --text "Done: BrainForge AI/ML section rebuilt with comprehensive deep learning curriculum" --mode now
