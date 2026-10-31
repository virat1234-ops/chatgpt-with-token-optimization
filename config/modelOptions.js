// Keep this list small and easy to understand. The IDs are OpenRouter model IDs.
export const MODEL_OPTIONS = [
    {
        id: "openrouter/free",
        name: "Auto (free models)",
        description: "Let OpenRouter choose an available free model",
    },
    {
        id: "nvidia/nemotron-3-ultra-550b-a55b:free",
        name: "NVIDIA Nemotron 3 Ultra",
        description: "General chat and reasoning",
    },
    {
        id: "nvidia/nemotron-3.5-lightning:free",
        name: "NVIDIA Nemotron 3.5 Lightning",
        description: "Fast responses",
    },
    {
        id: "cohere/north-mini-code:free",
        name: "Cohere North Mini Code",
        description: "Coding and software questions",
    },
];

export const getAvailableModels = () => {
    const models = [...MODEL_OPTIONS];
    const configuredDefault = process.env.DEFAULT_AI_MODEL;

    // Keep the model already configured in this project available in the dropdown.
    if (configuredDefault && !models.some((model) => model.id === configuredDefault)) {
        models.unshift({
            id: configuredDefault,
            name: "Project default model",
            description: "The model configured in your .env file",
        });
    }

    return models;
};

export const getDefaultModel = () =>
    process.env.DEFAULT_AI_MODEL || "openrouter/free";

export const isAvailableModel = (modelId) =>
    getAvailableModels().some((model) => model.id === modelId);
