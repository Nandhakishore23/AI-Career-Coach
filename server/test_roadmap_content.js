const roadmaps = require('./data/roadmaps');

console.log("Checking Frontend Developer Roadmap...");
const firstStep = roadmaps['Frontend Developer'][0];
console.log("Title:", firstStep.title);
console.log("Details Present?", !!firstStep.details);
if (firstStep.details) {
    console.log("Summary:", firstStep.details.summary);
    console.log("Resources:", firstStep.details.resources.length);
} else {
    console.error("CRITICAL: Details field is missing!");
}
