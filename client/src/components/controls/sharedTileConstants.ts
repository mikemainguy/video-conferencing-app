export const TILE_MAX_WIDTH = 200;
export const TILE_MIN_WIDTH = 64;
export const TILE_HEIGHT = 160; 

const style = {
  // ...other styles
  minWidth: TILE_MIN_WIDTH,
  maxWidth: TILE_MAX_WIDTH,
  aspectRatio: '16/9', // Add this for modern browsers, or use a wrapper div
  // ...other styles
}; 