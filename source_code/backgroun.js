
//Function to count when the extension is installed
/*window.oauth2Token = null;
const manifest = chrome.runtime.getManifest();
function authorize(token) {
    window.oauth2Token = token;
}
chrome.identity.getAuthToken({ interactive: true }, authorize);*/

chrome.runtime.onInstalled.addListener(( ) => {
    chrome.windows.getAll( { populate:true }, countTabs );
} );

//Function to update the badge when open a new tab
chrome.tabs.onUpdated.addListener(( ) => {
    chrome.windows.getAll( { populate:true }, countTabs );
} );

//Function to update the badge when close a tab
chrome.tabs.onRemoved.addListener(( ) => {
    chrome.windows.getAll( { populate:true }, countTabs );
} );

function countTabs ( winData ) {
    let tabs = [];
    for ( let i in winData ) {
        if ( winData[i].focused === true ) {
            let winTabs = winData[i].tabs;
            let totTabs = winTabs.length;
            for ( let j=0; j<totTabs; j++ ) {
                if( 0 !== winTabs[j].url.indexOf( "chrome://" ) ){
                    tabs.push( winTabs[j] );
                }
            }
        }
    }
    chrome.action.setBadgeText( { text: tabs.length.toString() } );
}