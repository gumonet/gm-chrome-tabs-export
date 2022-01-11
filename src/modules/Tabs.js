
const controlTabs = {
	init : function () {
		console.log( "Hello world from controller");
		chrome.windows.getAll( { populate:true }, controlTabs.getAllOpenTabs  );
		document.querySelector('#btn-save-document').addEventListener('click', controlTabs.queryOpenTabs )
	},
	getAllOpenTabs: function ( tabsOpen ){
		let content = document.querySelector( ' .list-tab-contain ' );
		console.log( tabsOpen );
		if( tabsOpen.length > 0 ){
			for( let tab of tabsOpen[0].tabs ) {
				let obj_url = new URL( tab.url );
				content.innerHTML +=
					'<a class="tab-item" href="'+tab.url+'" target="_blank">' +
					'<img src="' + tab.favIconUrl + '" class="icon-img" >' +
					'<div class="content-text"><h3>'+tab.title+'</h3>' +
					'<span>'+obj_url.hostname+'</span> </div>' +
					'</a>';
			}
		}
	},
	queryOpenTabs: function () {
		let querying = chrome.tabs.query({});
		querying.then(controlTabs.processTabs, controlTabs.errorHandler);
	},
	processTabs: function ( tabs ){
		let text = '## Links Session: ' + Date.now() +  '\t\n';
		let objTabs = [];
		for (let tab of tabs) {
			if( 0 !== tab.url.indexOf( "chrome://" ) ) {
				//objTabs.push({title: tab.title, link: tab.url});
				text += `- [${tab.title}](${tab.url})  \t\n `; //tab.title ;
			}
		}
		navigator.clipboard.writeText(text).catch(e => console.error('Cannot write to clipboard', e));
		//console.log( objTabs);
	},
	errorHandler: function ( error ){
		alert(`Error: ${error}`);
	}
}


export default controlTabs;