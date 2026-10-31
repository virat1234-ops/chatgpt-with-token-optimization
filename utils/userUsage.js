export const addUserTokenUsage = async (user, totalTokens) => {
    user.usage.tokenUsed += totalTokens;
    user.totalTokenUsed += totalTokens;

    await user.save();
};
