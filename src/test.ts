import { Gibun } from "./Gibun.js";
import { samples } from "./index.js";

async function test() {
  const aaa = new Gibun();
  await aaa.trainPreset("business");
  console.log(aaa.generate());
  return;
  // ビジネス文書風
  console.log("=== ビジネス文書風 ===");
  const gibunBusiness = new Gibun();
  await gibunBusiness.train(samples.business);
  console.log(gibunBusiness.generate({ minLength: 30, maxLength: 50 }));
  console.log();

  // SNS投稿風
  console.log("=== SNS投稿風 ===");
  const gibunSns = new Gibun();
  await gibunSns.train(samples.sns);
  console.log(gibunSns.generate({ minLength: 20, maxLength: 40 }));
  console.log();

  // ブログ記事風
  console.log("=== ブログ記事風 ===");
  const gibunBlog = new Gibun();
  await gibunBlog.train(samples.blog);
  console.log(gibunBlog.generate({ minLength: 30, maxLength: 50 }));
  console.log();

  // ニュース記事風
  console.log("=== ニュース記事風 ===");
  const gibunNews = new Gibun();
  await gibunNews.train(samples.news);
  console.log(gibunNews.generate({ minLength: 30, maxLength: 50 }));
  console.log();

  // 猫（既存）
  console.log("=== 吾輩は猫である ===");
  const gibunCat = new Gibun();
  await gibunCat.train(samples.cat);
  console.log(gibunCat.generate({ minLength: 30, maxLength: 50 }));
}

test();
