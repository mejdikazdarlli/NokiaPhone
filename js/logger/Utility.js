export function getIP(cb) {
    fetch('https://api.ipify.org?format=json')
        .then((res) => res.json())
        .then((res) => {
        if (cb) {
            cb(res.ip);
        }
    });
}
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export function getUserInformation() {
    let nVer = navigator.appVersion;
    let nAgt = navigator.userAgent;
    let browserName = navigator.appName;
    let fullVersion = '' + parseFloat(nVer);
    let majorVersion = parseInt(nVer, 10);
    let nameOffset, verOffset, ix;
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
        browserName = 'Opera';
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
        browserName = 'Microsoft Internet Explorer';
        fullVersion = nAgt.substring(verOffset + 5);
    }
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
        browserName = 'Chrome';
        fullVersion = nAgt.substring(verOffset + 7);
    }
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
        browserName = 'Safari';
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
        browserName = 'Firefox';
        fullVersion = nAgt.substring(verOffset + 8);
    }
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    if ((ix = fullVersion.indexOf(';')) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(' ')) != -1)
        fullVersion = fullVersion.substring(0, ix);
    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(nVer);
        majorVersion = parseInt(nVer, 10);
    }
    let OSName = 'Unknown OS';
    if (nVer.indexOf('Win') != -1)
        OSName = 'Windows';
    if (nVer.indexOf('Mac') != -1)
        OSName = 'MacOS';
    if (nVer.indexOf('X11') != -1)
        OSName = 'UNIX';
    if (nVer.indexOf('Linux') != -1)
        OSName = 'Linux';
    return {
        operating_system: OSName,
        browser_name: browserName,
        full_version: fullVersion,
        major_version: majorVersion,
        user_agent: nAgt,
    };
}
