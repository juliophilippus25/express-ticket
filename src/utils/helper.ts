export const getAssetsUrl = (path = "thumbnails") => {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  return `${appUrl}/uploads/${path}`;
};
