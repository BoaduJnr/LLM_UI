// Fully Updated TypeScript Models File for Puter AI Models
// Includes Providers, Model IDs, Capabilities, and Searchable Index

enum Provider {
  OpenAI = "OpenAI",
  Anthropic = "Anthropic",
  Qwen = "Qwen",
  xAI = "xAI",
  Google = "Google",
  MistralAI = "MistralAI",
  MiniMax = "MiniMax",
  DeepSeek = "DeepSeek",
  NVIDIA = "NVIDIA",
  Baidu = "Baidu",
  PixVerse = "PixVerse",
  Amazon = "Amazon",
  ArceeAI = "ArceeAI",
  AI21 = "AI21",
  NousResearch = "NousResearch",
  Meituan = "Meituan",
  DeepCogito = "DeepCogito",
  StabilityAI = "StabilityAI",
  LiquidAI = "LiquidAI",
  EssentialAI = "EssentialAI",
  Inception = "Inception",
  Gryphe = "Gryphe",
  Lykon = "Lykon",
  Alpindale = "Alpindale",
  ZAI = "Z.AI",
  AllenAI = "AllenAI",
  Perplexity = "Perplexity",
  Meta = "Meta"
}

enum Capability {
  Chat = "chat",
  Reasoning = "reasoning",
  Coding = "coding",
  Vision = "vision",
  Image = "image",
  Video = "video",
  Multimodal = "multimodal"
}

enum ModelID {
  // OpenAI
  GPT_5_2 = "openai/gpt-5.2",
  GPT_5_2_Chat = "openai/gpt-5.2-chat",
  GPT_5_2_Codex = "openai/gpt-5.2-codex",
  GPT_5_1 = "openai/gpt-5.1",
  GPT_5_1_Chat = "openai/gpt-5.1-chat",
  GPT_5_1_Codex = "openai/gpt-5.1-codex",
  GPT_4o = "openai/gpt-4o",
  GPT_4o_Mini = "openai/gpt-4o-mini",
  GPT_4o_Mini_Search = "openai/gpt-4o-mini-search-preview",
  GPT_3_5_Turbo = "openai/gpt-3.5-turbo",
  GPT_3_5_Turbo_0613 = "openai/gpt-3.5-turbo-0613",
  GPT_3_5_Turbo_16k = "openai/gpt-3.5-turbo-16k",
  O1 = "openai/o1",
  O3 = "openai/o3",
  O3_Mini = "openai/o3-mini",
  O4_Mini = "openai/o4-mini",
  O4_Mini_High = "openai/o4-mini-high",
  GPT_Image_1 = "openai/gpt-image-1",
  GPT_Image_1_Mini = "openai/gpt-image-1-mini",
  DALL_E_3 = "openai/dall-e-3",
  DALL_E_2 = "openai/dall-e-2",
  GPT_Audio = "openai/gpt-audio",
  GPT_Audio_Mini = "openai/gpt-audio-mini",
  Sora_2_Pro = "openai/sora-2-pro",

  // Anthropic
  Claude_Opus_4 = "anthropic/claude-opus-4",
  Claude_Opus_4_5 = "anthropic/claude-opus-4-5",
  Claude_Opus_4_6 = "anthropic/claude-opus-4-6",
  Claude_Sonnet_4 = "anthropic/claude-sonnet-4",
  Claude_Sonnet_4_5 = "anthropic/claude-sonnet-4-5",
  Claude_Haiku_4_5 = "anthropic/claude-haiku-4-5",
  Claude_3_7_Sonnet = "anthropic/claude-3-7-sonnet",
  Claude_3_7_Sonnet_Thinking = "anthropic/claude-3-7-sonnet:thinking",

  // Qwen
  Qwen3_235B_A22B = "qwen/qwen3-235b-a22b",
  Qwen3_8B = "qwen/qwen3-8b",
  Qwen3_4B_Free = "qwen/qwen3-4b:free",
  Qwen3_Coder_Next = "qwen/qwen3-coder-next",
  Qwen3_Max_Thinking = "qwen/qwen3-max-thinking",
  Qwen2_5_VL_72B = "qwen/qwen2.5-vl-72b-instruct",
  Qwen2_5_VL_32B = "qwen/qwen2.5-vl-32b-instruct",
  Qwen2_5_Coder_32B = "qwen/qwen-2.5-coder-32b-instruct",
  Qwen3_5_397B_A17B = "qwen/qwen3.5-397b-a17b",
  Qwen_Image = "qwen/qwen-image",
  QwQ_32B = "qwen/qwq-32b",

  // Z.AI
  GLM_5 = "z-ai/glm-5",
  GLM_4_6 = "z-ai/glm-4.6",
  GLM_4_7 = "z-ai/glm-4.7",
  GLM_4_6V = "z-ai/glm-4.6v",

  // AllenAI
  Olmo_2_8B = "allenai/olmo-2-8b",
  Olmo_3_7B_Think = "allenai/olmo-3-7b-think",

  // xAI/Grok
  Grok_4 = "x-ai/grok-4",
  Grok_4_Fast = "x-ai/grok-4-fast",
  Grok_4_Fast_Non_Reasoning = "x-ai/grok-4-fast-non-reasoning",
  Grok_4_1_Fast = "x-ai/grok-4-1-fast",
  Grok_4_1_Fast_Non_Reasoning = "x-ai/grok-4-1-fast-non-reasoning",
  Grok_Code_Fast_1 = "x-ai/grok-code-fast-1",
  Grok_3 = "x-ai/grok-3",
  Grok_3_Fast = "x-ai/grok-3-fast",
  Grok_3_Beta = "x-ai/grok-3-beta",
  Grok_3_Mini_Beta = "x-ai/grok-3-mini-beta",

  // Google
  Gemini_2_5_Flash = "google/gemini-2.5-flash-preview-09-2025",
  Gemini_2_5_Pro = "google/gemini-2.5-pro",
  Imagen_4_Fast = "google/imagen-4.0-fast",
  Gemma_3_4B = "google/gemma-3-4b-it",
  Gemma_3_12B = "google/gemma-3-12b-it",
  Gemma_3_27B = "google/gemma-3-27b-it",

  // Meta LLaMA
  Llama3_1_405B = "meta-llama/llama-3.1-405b",
  Llama3_1_405B_Instruct = "meta-llama/llama-3.1-405b-instruct",
  Llama3_1_70B_Instruct = "meta-llama/llama-3.1-70b-instruct",
  Llama3_1_8B_Instruct = "meta-llama/llama-3.1-8b-instruct",
  Llama4_Maverick = "meta-llama/llama-4-maverick",
  Llama4_Scout = "meta-llama/llama-4-scout",
  Llama_Guard_3_8B = "meta-llama/llama-guard-3-8b",
  Llama_Guard_2_8B = "meta-llama/llama-guard-2-8b",
  Llama3_8B_Instruct = "meta-llama/llama-3-8b-instruct",
  Llama3_2_3B_Instruct = "meta-llama/llama-3.2-3b-instruct",

  // DeepSeek
  DeepSeek_V3 = "deepseek/deepseek-v3-0324",
  DeepSeek_V3_2 = "deepseek/deepseek-v3.2",
  DeepSeek_R1 = "deepseek/deepseek-r1",
  DeepSeek_R1_Distill = "deepseek/deepseek-r1-distill-llama-70b",
  DeepSeek_Reasoner = "deepseek/deepseek-reasoner",

  // MiniMax
  MiniMax_M1 = "minimax/minimax-m1",
  MiniMax_M2 = "minimax/minimax-m2",
  MiniMax_M2_1 = "minimax/minimax-m2.1",
  MiniMax_M2_5 = "minimax/minimax-m2.5",
  MiniMax_Video_01_Director = "minimax/video-01-director",
  Hailuo_02 = "minimax/hailuo-02",

  // NVIDIA
  Nemotron_Nano_12B_V2_VL = "nvidia/nemotron-nano-12b-v2-vl",
  Nemotron_Nano_9B_V2 = "nvidia/nemotron-nano-9b-v2",
  NVIDIA_Llama3_49B = "nvidia/llama-3.3-nemotron-super-49b-v1.5",

  // Baidu
  ERNIE_4_5_21B = "baidu/ernie-4.5-21b-a3b-thinking",
  ERNIE_4_5_300B = "baidu/ernie-4.5-300b-a47b",
  ERNIE_4_5_VL_28B = "baidu/ernie-4.5-vl-28b-a3b",

  // PixVerse / others
  PixVerse_V5 = "pixverse/pixverse-v5",
  Spotlight = "arcee-ai/spotlight",
  RNJ_1_Instruct = "essentialai/rnj-1-instruct",
  DreamShaper = "lykon/dreamshaper",
  Sonar_Pro_Search = "perplexity/sonar-pro-search",

  // MistralAI
  Mistral_7B = "mistralai/open-mistral-7b",
  Mistral_7B_Instruct_v03 = "mistralai/mistral-7b-instruct-v0.3",
  Devstral_2 = "mistralai/devstral-2512",
  Devstral_Small = "mistralai/devstral-small",
  Pixtral_Large = "mistralai/pixtral-large-2411",
  Mistral_Large_2411 = "mistralai/mistral-large-2411",
  Mistral_Medium_2508 = "mistralai/mistral-medium-2508",
  Mixtral_8x22B_Instruct = "mistralai/mixtral-8x22b-instruct"

}

interface ModelInfo {
  provider: Provider;
  capabilities: Capability[];
}

const Models: Record<ModelID, ModelInfo> = {
  [ModelID.GPT_5_2]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Coding, Capability.Reasoning] },
  [ModelID.GPT_Image_1]: { provider: Provider.OpenAI, capabilities: [Capability.Image, Capability.Multimodal] },
  [ModelID.DALL_E_3]: { provider: Provider.OpenAI, capabilities: [Capability.Image, Capability.Multimodal] },
  [ModelID.Claude_Opus_4]: { provider: Provider.Anthropic, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Qwen3_5_397B_A17B]: { provider: Provider.Qwen, capabilities: [Capability.Chat, Capability.Reasoning, Capability.Multimodal] },
  [ModelID.Grok_4]: { provider: Provider.xAI, capabilities: [Capability.Chat, Capability.Reasoning, Capability.Coding] },
  [ModelID.Gemini_2_5_Flash]: { provider: Provider.Google, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Mistral_Large_2411]: { provider: Provider.MistralAI, capabilities: [Capability.Reasoning] },
  [ModelID.MiniMax_M2_5]: { provider: Provider.MiniMax, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.DeepSeek_Reasoner]: { provider: Provider.DeepSeek, capabilities: [Capability.Reasoning] },
  [ModelID.Nemotron_Nano_12B_V2_VL]: { provider: Provider.NVIDIA, capabilities: [Capability.Reasoning, Capability.Coding] },
  [ModelID.ERNIE_4_5_21B]: { provider: Provider.Baidu, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.PixVerse_V5]: { provider: Provider.PixVerse, capabilities: [Capability.Vision, Capability.Image, Capability.Video, Capability.Multimodal] },
  [ModelID.Spotlight]: { provider: Provider.ArceeAI, capabilities: [Capability.Chat, Capability.Reasoning, Capability.Vision] },
  [ModelID.RNJ_1_Instruct]: { provider: Provider.EssentialAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.DreamShaper]: { provider: Provider.Lykon, capabilities: [Capability.Image] },
  [ModelID.Sonar_Pro_Search]: { provider: Provider.Perplexity, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.GPT_5_2_Chat]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Reasoning, Capability.Coding] },
  [ModelID.GPT_5_2_Codex]: { provider: Provider.OpenAI, capabilities: [Capability.Coding] },
  [ModelID.GPT_5_1]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.GPT_5_1_Chat]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.GPT_5_1_Codex]: { provider: Provider.OpenAI, capabilities: [Capability.Coding] },
  [ModelID.GPT_4o]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.GPT_4o_Mini]: { provider: Provider.OpenAI, capabilities: [Capability.Chat] },
  [ModelID.GPT_4o_Mini_Search]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.GPT_3_5_Turbo]: { provider: Provider.OpenAI, capabilities: [Capability.Chat] },
  [ModelID.GPT_3_5_Turbo_0613]: { provider: Provider.OpenAI, capabilities: [Capability.Chat] },
  [ModelID.GPT_3_5_Turbo_16k]: { provider: Provider.OpenAI, capabilities: [Capability.Chat] },
  [ModelID.O1]: { provider: Provider.OpenAI, capabilities: [Capability.Coding] },
  [ModelID.O3]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.O3_Mini]: { provider: Provider.OpenAI, capabilities: [Capability.Chat] },
  [ModelID.O4_Mini]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.O4_Mini_High]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.GPT_Image_1_Mini]: { provider: Provider.OpenAI, capabilities: [Capability.Image, Capability.Multimodal] },
  [ModelID.DALL_E_2]: { provider: Provider.OpenAI, capabilities: [Capability.Image] },
  [ModelID.GPT_Audio]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Multimodal] },
  [ModelID.GPT_Audio_Mini]: { provider: Provider.OpenAI, capabilities: [Capability.Chat] },
  [ModelID.Sora_2_Pro]: { provider: Provider.OpenAI, capabilities: [Capability.Chat, Capability.Reasoning] },

  [ModelID.Claude_Opus_4_5]: { provider: Provider.Anthropic, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Claude_Opus_4_6]: { provider: Provider.Anthropic, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Claude_Sonnet_4]: { provider: Provider.Anthropic, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Claude_Sonnet_4_5]: { provider: Provider.Anthropic, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Claude_Haiku_4_5]: { provider: Provider.Anthropic, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Claude_3_7_Sonnet]: { provider: Provider.Anthropic, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Claude_3_7_Sonnet_Thinking]: { provider: Provider.Anthropic, capabilities: [Capability.Chat, Capability.Reasoning] },

  [ModelID.Qwen3_235B_A22B]: { provider: Provider.Qwen, capabilities: [Capability.Chat, Capability.Reasoning, Capability.Multimodal] },
  [ModelID.Qwen3_8B]: { provider: Provider.Qwen, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Qwen3_4B_Free]: { provider: Provider.Qwen, capabilities: [Capability.Chat] },
  [ModelID.Qwen3_Coder_Next]: { provider: Provider.Qwen, capabilities: [Capability.Coding] },
  [ModelID.Qwen3_Max_Thinking]: { provider: Provider.Qwen, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Qwen2_5_VL_72B]: { provider: Provider.Qwen, capabilities: [Capability.Chat, Capability.Vision, Capability.Multimodal] },
  [ModelID.Qwen2_5_VL_32B]: { provider: Provider.Qwen, capabilities: [Capability.Chat, Capability.Vision, Capability.Multimodal] },
  [ModelID.Qwen2_5_Coder_32B]: { provider: Provider.Qwen, capabilities: [Capability.Coding] },
  [ModelID.Qwen_Image]: { provider: Provider.Qwen, capabilities: [Capability.Image, Capability.Multimodal] },
  [ModelID.QwQ_32B]: { provider: Provider.Qwen, capabilities: [Capability.Chat, Capability.Reasoning] },

  [ModelID.GLM_5]: { provider: Provider.ZAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.GLM_4_6]: { provider: Provider.ZAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.GLM_4_7]: { provider: Provider.ZAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.GLM_4_6V]: { provider: Provider.ZAI, capabilities: [Capability.Chat, Capability.Vision, Capability.Multimodal] },

  [ModelID.Olmo_2_8B]: { provider: Provider.AllenAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Olmo_3_7B_Think]: { provider: Provider.AllenAI, capabilities: [Capability.Chat, Capability.Reasoning] },

  [ModelID.Grok_4_Fast]: { provider: Provider.xAI, capabilities: [Capability.Chat, Capability.Reasoning, Capability.Coding] },
  [ModelID.Grok_4_Fast_Non_Reasoning]: { provider: Provider.xAI, capabilities: [Capability.Chat, Capability.Coding] },
  [ModelID.Grok_4_1_Fast]: { provider: Provider.xAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Grok_4_1_Fast_Non_Reasoning]: { provider: Provider.xAI, capabilities: [Capability.Chat] },
  [ModelID.Grok_Code_Fast_1]: { provider: Provider.xAI, capabilities: [Capability.Coding] },
  [ModelID.Grok_3]: { provider: Provider.xAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Grok_3_Fast]: { provider: Provider.xAI, capabilities: [Capability.Chat] },
  [ModelID.Grok_3_Beta]: { provider: Provider.xAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Grok_3_Mini_Beta]: { provider: Provider.xAI, capabilities: [Capability.Chat] },

  [ModelID.Gemini_2_5_Pro]: { provider: Provider.Google, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Imagen_4_Fast]: { provider: Provider.Google, capabilities: [Capability.Image, Capability.Multimodal] },
  [ModelID.Gemma_3_4B]: { provider: Provider.Google, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Gemma_3_12B]: { provider: Provider.Google, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Gemma_3_27B]: { provider: Provider.Google, capabilities: [Capability.Chat, Capability.Reasoning] },

  [ModelID.Llama3_1_405B]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Llama3_1_405B_Instruct]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Llama3_1_70B_Instruct]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Llama3_1_8B_Instruct]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Llama4_Maverick]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Llama4_Scout]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Llama_Guard_3_8B]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Llama_Guard_2_8B]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Llama3_8B_Instruct]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Llama3_2_3B_Instruct]: { provider: Provider.Meta, capabilities: [Capability.Chat, Capability.Reasoning] },

  [ModelID.DeepSeek_V3]: { provider: Provider.DeepSeek, capabilities: [Capability.Reasoning] },
  [ModelID.DeepSeek_V3_2]: { provider: Provider.DeepSeek, capabilities: [Capability.Reasoning] },
  [ModelID.DeepSeek_R1]: { provider: Provider.DeepSeek, capabilities: [Capability.Reasoning] },
  [ModelID.DeepSeek_R1_Distill]: { provider: Provider.DeepSeek, capabilities: [Capability.Reasoning] },

  [ModelID.MiniMax_M1]: { provider: Provider.MiniMax, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.MiniMax_M2]: { provider: Provider.MiniMax, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.MiniMax_M2_1]: { provider: Provider.MiniMax, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.MiniMax_Video_01_Director]: { provider: Provider.MiniMax, capabilities: [Capability.Video, Capability.Multimodal] },
  [ModelID.Hailuo_02]: { provider: Provider.MiniMax, capabilities: [Capability.Chat] },

  [ModelID.Nemotron_Nano_9B_V2]: { provider: Provider.NVIDIA, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.NVIDIA_Llama3_49B]: { provider: Provider.NVIDIA, capabilities: [Capability.Chat, Capability.Reasoning] },

  [ModelID.ERNIE_4_5_300B]: { provider: Provider.Baidu, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.ERNIE_4_5_VL_28B]: { provider: Provider.Baidu, capabilities: [Capability.Chat, Capability.Vision, Capability.Multimodal] },
  [ModelID.Mistral_7B]: { provider: Provider.MistralAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Mistral_7B_Instruct_v03]: { provider: Provider.MistralAI, capabilities: [Capability.Chat, Capability.Reasoning, Capability.Coding] },
  [ModelID.Devstral_2]: { provider: Provider.MistralAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Devstral_Small]: { provider: Provider.MistralAI, capabilities: [Capability.Chat] },
  [ModelID.Pixtral_Large]: { provider: Provider.MistralAI, capabilities: [Capability.Chat, Capability.Reasoning, Capability.Multimodal] },
  [ModelID.Mistral_Medium_2508]: { provider: Provider.MistralAI, capabilities: [Capability.Chat, Capability.Reasoning] },
  [ModelID.Mixtral_8x22B_Instruct]: { provider: Provider.MistralAI, capabilities: [Capability.Chat, Capability.Reasoning, Capability.Coding] }

};


const platformSelect = document.getElementById("platform-select") as HTMLSelectElement;
Object.values(Provider).forEach(provider => {
  const option = document.createElement("option");
  option.value = provider.toString();
  option.textContent = provider.toString();
  platformSelect.appendChild(option);
})

const modelCapabilities = document.getElementById("capabilities") as HTMLSelectElement;
Object.values(Capability).forEach(capability => {
  const option = document.createElement("option");
  option.value = capability;
  option.textContent = capability.charAt(0).toUpperCase() + capability.slice(1); // "Chat"
  modelCapabilities.appendChild(option);
});


const modelList = document.getElementById("model-list") as HTMLSelectElement;
let selectedModel = null;
let selectedPlatform: string | null = null


platformSelect.addEventListener("change", modelOptions);

modelCapabilities.addEventListener("change", modelOptions);

function modelOptions() {
  selectedPlatform = platformSelect.value;
  const selectedCapabilities = Array.from(modelCapabilities.selectedOptions)
    .map(opt => toCapability(opt.value.toLowerCase()));

  const selectedModels = Object.entries(Models).filter(([key, model]) => {
    const matchesCapability = selectedCapabilities.length === 0
      || model.capabilities.some(c => selectedCapabilities.includes(c));

    const matchesProvider = !selectedPlatform || selectedPlatform.length === 0
      || model.provider.toString() === selectedPlatform;

    return matchesCapability && matchesProvider;
  }).map(([key, model]) => key.toString());

  modelList.innerHTML = "";
  if (selectedModels.length === 0) {
    modelList.innerHTML = "<li><em>No models available</em></li>";
    return;
  }

  selectedModels.forEach(model => {
    const li = document.createElement("li");
    li.textContent = model;
    li.classList.add("selectable-item");

    li.addEventListener("click", () => {
      // Remove active from all
      document.querySelectorAll(".selectable-item").forEach(item => item.classList.remove("active"));

      // Add active to selected
      li.classList.add("active");
      selectedModel = model;

      console.log("Selected model:", selectedModel);
    });

    modelList.appendChild(li);
  });
}


function toCapability(value: string): Capability {
  if (!Object.values(Capability).includes(value as Capability)) {
    throw new Error(`Invalid capability: ${value}`);
  }
  return value as Capability;
}