//Function to add the list of tabs to popup
chrome.windows.getAll( { populate:true }, getAllOpenWindows );
function getAllOpenWindows( winData ) {

    let tabs = [];
    let content = document.querySelector( ' .list-tab-contain ' );

    for ( let i in winData ) {
        if ( winData[i].focused === true ) {
            let winTabs = winData[i].tabs;
            let totTabs = winTabs.length;
            for ( let j=0; j<totTabs; j++ ) {
                if( 0 !== winTabs[j].url.indexOf( "chrome://" ) ){
                    tabs.push( winTabs[j] );
                    let obj_url = new URL( winTabs[j].url );
                    content.innerHTML +=
                        '<a class="tab-item" href="'+winTabs[j].url+'" target="_blank">' +
                        '<img src="' + winTabs[j].favIconUrl + '" class="icon-img" >' +
                        '<div class="content-text"><h3>'+winTabs[j].title+'</h3>' +
                        '<span>'+obj_url.hostname+'</span> </div>' +
                        '</a>';
                }

            }
        }
    }
    //document.querySelector( '#tab-numbers' ).textContent = tabs.length;
    chrome.action.setBadgeText( { text: tabs.length.toString() } );
}


    document.querySelector('#btn-save-document').addEventListener('click', function() {
        clean_message();
        //create_and_save_document( array_links );
        function logTabs(tabs) {
            let array_data = [];
            for (let tab of tabs) {
                if( 0 !== tab.url.indexOf( "chrome://" ) ) {
                    array_data.push({title: tab.title, link: tab.url});
                }
            }
            create_and_save_document( array_data );
        }

        function onError(error) {
            console.log(`Error: ${error}`);
        }

        let querying = chrome.tabs.query({});
        querying.then(logTabs, onError);
    });

    function create_and_save_document( array_links ){
        const global_array_links = array_links;
        spinner_set_status( true );
        chrome.identity.getAuthToken({interactive: true}, async function(token) {

            const manifest = chrome.runtime.getManifest();

            let body = {
                //"documentId": "",
                "body": {
                },
                "title": "TabGator_" + Date.now() //Change to set Documen title
            }

            let response = await fetch('https://docs.googleapis.com/v1/documents/',{
                method: "POST",
                body: JSON.stringify(body),
                headers:{
                    'Content-type': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                }
            })

            if( response.ok ){
                //Document created
                let data      = await response.json();
                let id        = data.documentId;
                let data_urls = {
                    requests: []
                };
                let index     = 0 ;
                let index_end = 1;

                array_links.forEach( (item, i ) => {

                    index     = index_end;
                    index_end = index_end + ( item.title.length ) + 1;

                    data_urls.requests.push( {
                        "insertText": {
                            "text": item.title + "\n",
                            "location": {
                                "index": index
                            }
                        }
                    });

                    data_urls.requests.push( {
                            "updateTextStyle": {
                                "textStyle": {
                                    "link": {
                                        "url": item.link
                                    }
                                },
                                "range": {
                                    "startIndex": index,
                                    "endIndex": index_end
                                },
                                "fields": "link"
                            }
                        },
                    );
                })


                let response_insert_data = await fetch('https://docs.googleapis.com/v1/documents/' + id + ':batchUpdate',{
                    method: "POST",
                    body: JSON.stringify( data_urls ),
                    headers:{
                        'Content-type': 'application/json',
                        'Authorization' : `Bearer ${token}`,
                    }
                })
                let data_insert = await response_insert_data.json();
                spinner_set_status( false );
                window.open(`https://docs.google.com/document/d/${data_insert.documentId}/edit`, '_blank');
                console.log( data_insert );

            }else{
                console.log( '*************** ERROR ****************');
                let data_error = await response.json();
                spinner_set_status(false);
                set_message('error',
                    `<h3>¡ERROR!</h3>
                    <p>
                        <strong>Code</strong>: ${data_error.error.code} <br>
                        <strong>Message</strong>: ${data_error.error.message}
                    </p>`
                )
                console.log( data_error );
            }

        });
    }

    function spinner_set_status( active ) {
        let spinner_el = document.querySelector('.spinner-content');
        let button = document.querySelector('#btn-save-document');
        if( active ){
            spinner_el.classList.add('active');
            button.style.display = 'none';
            return true;
        }
        spinner_el.classList.remove('active');
        button.style.display = 'flex';
        return false;
    }

    function set_message( type, content ) {
        let message_container = document.querySelector('#messages-content');
        message_container.innerHTML = `<div class="message-item ${type}">${ content }</div>`;
    }

    function clean_message(){
        let message_container = document.querySelector('#messages-content');
        message_container.innerHTML = '';
    }