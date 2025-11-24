export const getImageUrl = (path) => {
  const base = process.env.REACT_APP_IMG_PATH;
  return path ? `${base}/${path}` : null;
};
