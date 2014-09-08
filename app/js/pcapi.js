/*
Copyright (c) 2014, EDINA.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this
   list of conditions and the following disclaimer in the documentation and/or
   other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software must
   display the following acknowledgement: This product includes software
   developed by the EDINA.
4. Neither the name of the EDINA nor the names of its contributors may be used to
   endorse or promote products derived from this software without specific prior
   written permission.

THIS SOFTWARE IS PROVIDED BY EDINA ''AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL EDINA BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
DAMAGE.
*/

"use strict";

var pcapi = function() {

    /**
     * Unset user login id.
     */
    var clearCloudLogin = function(){
        localStorage.setItem('cloud-user', JSON.stringify({'id': undefined}));
    };

    return {

        /**
         * Login to cloud provider.
         * @param callback Function called after login attemt.
         * @param cbrowser Function to allow caller requires access to childbrowser.
         */
        doLogin: function(callback, cbrowser){
            var loginUrl = this.getCloudProviderUrl() + '/auth/'+this.getProvider();

            var pollTimer, pollTimerCount = 0, pollInterval = 3000, pollForMax = 5 * 60 * 1000; //min

            var userId = this.getUserId();
            if(userId !== undefined){
                console.debug("got a user id: " + userId);
                loginUrl += '/' + userId;
            }

            // clear user id
            clearCloudLogin();
            console.debug('Login with: ' + loginUrl + '?async=true');

            $.ajax({
                url: loginUrl + '?async=true',
                timeout: 3000,
                cache: false,
                success: function(data){
                    console.debug("Redirect to: " + data.url);
                    var cloudUserId = data.userid;

                    // close child browser
                    var closeCb = function(userId){
                        clearInterval(pollTimer);
                        callback(true, userId);
                    };

                    // open dropbox login in child browser
                    var cb = window.open(data.url, '_blank', 'location=no');
                    //cb.addEventListener('exit', closeCb);

                    var pollUrl = loginUrl + '/' + cloudUserId + '?async=true';
                    console.debug('Poll: ' + pollUrl);
                    pollTimer = setInterval(function(){
                        $.ajax({
                            url: pollUrl,
                            success: function(pollData){
                                pollTimerCount += pollInterval;

                                if(pollData.state === 1 || pollTimerCount > pollForMax){
                                    if(pollData.state === 1 ){
                                        this.setUserId(cloudUserId);
                                    }
                                    cb.close();
                                    closeCb(cloudUserId);
                                }
                            },
                            error: function(error){
                                console.error("Problem polling api: " + error.statusText);
                                closeCb(-1);
                            },
                            cache: false
                        });
                    }, pollInterval);

                    if(cbrowser){
                        // caller may want access to child browser reference
                        cbrowser(cb);
                    }
                },
                error: function(jqXHR, textStatus){
                    var msg;
                    if(textStatus === undefined){
                        textStatus = ' Unspecified Error.';
                    }
                    else if(textStatus === "timeout") {
                        msg = "Unable to login, please enable data connection.";
                    }
                    else{
                        msg = "Problem with login: " + textStatus;
                    }

                    console.error(msg);
                    callback(false, msg);
                }
            });
        },

        /**
         * Initialize pcapi object
         * @param options.url url of the PCAPI
         * @param options.version version number of PCAPI
         */
        init: function(options){
            this.cloudProviderUrl = options.url + "/" + options.version + "/pcapi";
        },

        /**
         * Check if the user is logged in
         * @param callback function after checking the login status
         */
        checkIfLoggedIn: function(callback){
            console.log("check if user is logged in");

            $.ajax({
                url: this.getCloudProviderUrl() + '/auth',
                type: "GET",
                cache: false,
                success: function(response){
                    callback(true, response);
                },
                error: function(jqXHR, status, error){
                    callback(false, error);
                }
            });
        },

        /**
         * filter Records
         */
        filterRecords: function(callback){
            this.getItems
        },

        /**
         * @return The URL to the cloud provider.
         */
        getCloudProviderUrl: function() {
            return this.cloudProviderUrl;
        },

        /**
         * Fetch all the items on the cloud
         * @param remoteDir remote directory
         * @param callback function after fetching the items
         */
        getFSItems: function(remoteDir, callback){
            var url = this.getCloudProviderUrl() + '/fs/' +
                this.getProvider() + '/' + this.getUserId() +'/'+remoteDir+'/';

            console.debug("Get items of "+remoteDir+" with " + url);

            $.ajax({
                type: "GET",
                dataType: "json",
                url: url,
                success: function(data){
                    if(data.error == 1){
                        callback(false);
                    }
                    else{
                        callback(true, data);
                    }
                },
                error: function(jqXHR, status, error){
                    console.error("Problem with " + url + " : status=" +
                                  status + " : " + error);
                    callback(false);
                },
                cache: false
            });
        },

        /**
         * Fetch all the records|editors on the cloud
         * @param remoteDir remote directory [records|editors]
         * @param callback function after fetching the items
         */
        getItems: function(remoteDir, filters, callback){
            var url = this.getCloudProviderUrl() + '/'+remoteDir+'/' +
                this.getProvider() + '/' + this.getUserId() +'/';

            console.debug("Get items of "+remoteDir+" with " + url);
            //if it's undefined make it empty object in order not to break it
            if(filters === undefined){
                filters = {};
            }

            $.ajax({
                type: "GET",
                dataType: "json",
                url: url,
                data: filters,
                success: function(data){
                    if(data.error == 1){
                        callback(false);
                    }
                    else{
                        callback(true, data);
                    }
                },
                error: function(jqXHR, status, error){
                    console.error("Problem with " + url + " : status=" +
                                  status + " : " + error);
                    callback(false);
                },
                cache: false
            });
        },

        /**
         * Get all providers PCAPI supports
         * @param callback function after fetching the providers
         */
        getProviders: function(callback){
            var url = this.getCloudProviderUrl()+"/auth/providers";
            $.ajax({
                url: url,
                dataType: "json",
                cache: false
            }).done(function(data){
                callback(true, data);
            }).error(function(jqXHR, status, error){
                console.error("Problem with " + url + " : status=" +
                                  status + " : " + error);
                callback(false);
            });
        },

        /**
         * TODO
         */
        getProvider: function(){
            return localStorage.getItem('cloud-provider');
        },

        /**
         * TODO
         */
        getUserId: function(){
            return this.userId;
        },

        saveItem: function(){
            
        },

        /**
         * TODO
         */
        setProvider: function(provider){
            this.provider = provider;
        },

        /**
         * TODO
         */
        setUserId: function(userId){
            this.userId = userId;
        },

        /**
         * function for uploading a file
         * @param remoteDir
         * @param filename
         */
        uploadFile: function(remoteDir, filename, callback){
            var url = this.getCloudProviderUrl() + '/fs/' +
                this.getProvider() + '/' + this.getUserId() +'/'+remoteDir+'/'+filename;

            console.debug("Upload item "+filename+" to "+remoteDir+" with " + url);

            $.ajax({
                type: "POST",
                beforeSend: function(request) {
                    request.setRequestHeader("X-Parse-Application-Id", 'MY-APP-ID');
                    request.setRequestHeader("X-Parse-REST-API-Key", 'MY-REST-API-ID');
                    request.setRequestHeader("Content-Type", file.type);
                },
                url: url,
                data: file,
                processData: false,
                contentType: false,
                success: function(data) {
                    callback(true, data);
                },
                error: function(data) {
                    var obj = jQuery.parseJSON(data);
                    callback(false, obj.error);
                }
            });
        },

        /**
         *
         */
        uploadItem: function(){
            
        }
    };
};