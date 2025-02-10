export const buildUrl = (path) => {
    // Assuming your assets are stored in the 'public' directory
    return `${process.env.PUBLIC_URL || ''}${path}`;
  };