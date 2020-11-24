"use strict";

chrome.runtime.onInstalled.addListener(function (details) {

    var sites =
        [
            { name: 'Facebook', url: 'https://www.facebook.com/', imgUrl: 'facebook.jpg', id: 0 },
            { name: 'YouTube', url: 'https://www.youtube.com/', imgUrl: 'youtube.jpg', id: 2 },
            { name: 'Instagram', url: 'https://instagram.com/', imgUrl: 'instagram.jpg', id: 3 },
            { name: 'Twitter', url: 'https://twitter.com/', imgUrl: 'twitter.jpg', id: 4 }
        ];
    var icons =
        [
            { name: 'Default', imgUrl: 'default.jpg' },
            

        ];
    var backgroundImage = '/images/bg.jpg';
    var editImage = '/images/edit.jpg';

    function readImage(url, callback) {
        function onError() { callback(''); }
        function onXhrGet(status, response) {
            function onReaderLoad(result) { callback(result); }
            if (status == 200) {
                readFile(response, onReaderLoad, onError);
            } else { onError(); }
        }
        getViaXhr(url, 'blob', onXhrGet);
    }

    // Recursive function to process an array of images. Objects in array
    // must contain an 'imgUrl' variable containing the name of the image
    function readImageArray(images, currentIndex, endCallback) {
        if (currentIndex === images.length) {
            endCallback();
        } else {
            let imgUrl = '/images/' + images[currentIndex].imgUrl;
            readImage(imgUrl, function (result) {
                if (result.length) {
                    images[currentIndex].imgUrl = result;
                    readImageArray(images, currentIndex + 1, endCallback);
                } else {
                    images.splice(currentIndex, 1);
                    readImageArray(images, currentIndex, endCallback);
                }
            });
        }
    }

    function getViaXhr(url, responseType, onLoad, onError) {
        var request = new XMLHttpRequest();
        request.responseType = responseType;
        request.open('GET', url, true);
        request.addEventListener("error", onError);
        request.addEventListener("load", function () { onLoad(request.status, request.response) });
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send();
    }

    function readFile(file, onLoad, onError) {
        var reader = new FileReader();
        reader.addEventListener("error", onError);
        reader.addEventListener("load", function () { onLoad(reader.result) });
        reader.readAsDataURL(file);
    }

    function saveAllSettings() {
        chrome.storage.local.set({
            'sites': sites, 'icons': icons, 'backgroundImage': backgroundImage,
            'editImage': editImage, 'showBookmarkNames': 'hover',
            'bookmarkPosition': 'middle'
        }, function () { });
    }

    function saveSetting(setting, callback) {
        chrome.storage.local.set(setting, callback);
    }

    // On fresh install, load default images and settings
    if (details.reason == 'install') {
        // Potentially convoluted series of asychronous calls to load data and save it in chrome storage
        readImageArray(sites, 0, function () { // Load sites
            readImageArray(icons, 0, function () { // Load icons
                readImage(backgroundImage, function (result) { // Load background image
                    backgroundImage = result;
                    readImage(editImage, function (result) { // Load edit image then save settings
                        editImage = result;
                        saveAllSettings();
                    });
                })
            })
        });
    } else if (details.reason === 'update') {
        readImageArray(icons, 0, function () {
            saveSetting({ 'icons': icons }, function() {
                chrome.runtime.openOptionsPage(function() { 
                    alert('Elemental New Tab has been updated. Thank you for your continued support!'); 
                })
            });
        });
    }
});