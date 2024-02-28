// Fix intial width panels
try {
    const sizes = JSON.parse(localStorage.getItem("panels-sizes"));
    const rules = `
        ${sizes ? `.main-nav { width:calc(${sizes[0] ?? 0}% - 3px); }` : ""}
        .page.loading { visibility: visible; }
    `;
    document.head.appendChild(document.createElement("style")).innerHTML=rules; 
} catch (ignore) {}