import { execSync } from 'child_process';

const hash = execSync('git rev-parse --short HEAD').toString().trim();

export default {
    version: hash,
    title: "Xule Lin",
    titleZh: "林徐乐",
    description: "What becomes impossible to see when algorithms enter organizational life — not as tools.",
    descriptionZh: "当算法进入组织生活——不作为工具——时，什么变得不可见。",
    url: "https://linxule.com",
    author: "Xule Lin",
    authorZh: "林徐乐",
    language: "en"
};
