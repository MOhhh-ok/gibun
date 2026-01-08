import { Gibun } from "./Gibun.js";
import blog from "./presets/blog.js";
import business from "./presets/business.js";
import cat from "./presets/cat.js";
import news from "./presets/news.js";
import sns from "./presets/sns.js";

const gibun = new Gibun();

const samples = {
  cat,
  business,
  sns,
  blog,
  news,
};

export { gibun, samples };
