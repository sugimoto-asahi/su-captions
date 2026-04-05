import "@swc-uxp-internal/icons-workflow/icons/sp-icon-add-circle"

const ppro = require("premierepro");

// Call the Premiere Pro API to populate Application Info area.
async function populateProjectInfo() {
  // Get the active project.
  const project = await ppro.Project.getActiveProject();
  if (!project) {
    log("There is no active project found", "red");
  } else {
    log(`Active project: ${project.name}`);
    // Get the active sequence.
    const sequence = await project.getActiveSequence();
    const time = await sequence.getInPoint();
    log("In point is " + time.seconds);
    if (!sequence) {
      log("There is no active sequence found", "red");
    } else {
      log(`Active sequence: ${sequence.name}`);
    }
  }
}

// Event listener for the Populate Application Info button.
document
  .querySelector("#btnPopulate")!
  .addEventListener("click", populateProjectInfo);

// Event listener for the Clear Application Info button.
document.querySelector("#clear-btn")!.addEventListener("click", () => {
  document.getElementById("plugin-body")!.innerHTML = "";
});

// Log function to display messages in the plugin body.
function log(msg: string | number, color?: string) {
  document.getElementById("plugin-body")!.innerHTML += color
    ? `<span style='color:${color}'>${msg}</span><br />`
    : `${msg}<br />`;
}

function updateTheme(theme: string) {
  const panelBody = document.getElementById("plugin-body");
  const panelHeading = document.getElementById("plugin-heading"); 
  if(theme.includes("dark")) {
    panelBody!.style.color = "#fff";
    panelHeading!.style.color = "#fff";
  } else {
    panelBody!.style.color = "#000";
    panelHeading!.style.color = "#000";
  }
}

(document as any).theme.onUpdated.addListener((theme: string) => {
	updateTheme(theme);
})

const currentTheme = (document as any).theme.getCurrent();
updateTheme(currentTheme);
