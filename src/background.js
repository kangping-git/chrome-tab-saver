chrome.contextMenus.create({
    title : 'Save Tab',
    type : 'normal',
    contexts : ['all'],
    id: 'Main'
});
const getStorage = (key = null) => new Promise(resolve => {
    chrome.storage.local.get(key, (data) => {resolve(data)});
});
chrome.contextMenus.create({
    title : 'Save Tab',
    type : 'normal',
    contexts : ['all'],
    parentId: "Main",
    id: 'SaveTab'
});
for (var i = 1;i < 10;++i){
    let s = i;
    (async () => {
        let data = await getStorage('memory' + s);
        if (data["memory" + s]){
            chrome.contextMenus.create({
                title : 'Memory-' + s + " (" + (data["memory" + s].title.length > 12 ? (data["memory" + s].title.slice(0,9) + "...") : data["memory" + s].title) + ")",
                type : 'normal',
                contexts : ['all'],
                parentId: "SaveTab",
                id: 'Smemory' + s,
                onclick:() => {save(s)}
            });
        }else{
            chrome.contextMenus.create({
                title : 'Memory-' + s,
                type : 'normal',
                contexts : ['all'],
                parentId: "SaveTab",
                id: 'Smemory' + s,
                onclick:() => {save(s)}
            });
        }
    })();
}
chrome.contextMenus.create({
    title : 'Load Tab',
    type : 'normal',
    contexts : ['all'],
    parentId: "Main",
    id: 'LoadTab'
});
for (var i = 1;i < 10;++i){
    let s = i;
    (async () => {
        let data = await getStorage('memory' + s);
        if (data["memory" + s]){
            chrome.contextMenus.create({
                title : 'Memory-' + s + " (" + (data["memory" + s].title.length > 12 ? (data["memory" + s].title.slice(0,9) + "...") : data["memory" + s].title) + ")",
                type : 'normal',
                contexts : ['all'],
                parentId: "LoadTab",
                id: 'Lmemory' + s,
                onclick:() => {load(s)}
            });
        }else{
            chrome.contextMenus.create({
                title : 'Memory-' + s,
                type : 'normal',
                contexts : ['all'],
                parentId: "LoadTab",
                id: 'Lmemory' + s,
                onclick:() => {load(s)}
            });
        }
    })();
}
function load(memory_num){
    chrome.storage.local.get("memory" + memory_num,(data) => {
        chrome.tabs.create({
            url:data["memory" + memory_num].url
        })
    })
}
function save(memory_num){
    option = {}
    chrome.tabs.query({active: true, lastFocusedWindow:true},tabs => {
        option["memory" + memory_num] = {
            url:tabs[0].url,
            title:tabs[0].title
        }
        chrome.contextMenus.update("Smemory" + memory_num,{title:"memory-" + memory_num + " (" + (tabs[0].title.length > 12 ? (tabs[0].title.slice(0,9) + "...") : (tabs[0].title)) + ")"})
        chrome.contextMenus.update("Lmemory" + memory_num,{title:"memory-" + memory_num + " (" + (tabs[0].title.length > 12 ? (tabs[0].title.slice(0,9) + "...") : (tabs[0].title)) + ")"})
        chrome.storage.local.set(option,() => {
        })
    })
}