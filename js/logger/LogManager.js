import { UrlManager } from './UrlManager.js'


export class LogManager {
    constructor() {
        const baseUrl = UrlManager.getInstance().getBaseUrl();
        this.GET_URL = `${baseUrl}/analytics`;
        this.POST_URL = `${baseUrl}/analytics/`;
    }
    upload(sessionData) {
        const formData = new FormData();
        for (let key in sessionData) {
            if (sessionData.hasOwnProperty(key)) {
                formData.append(key, sessionData[key]);
            }
        }
        fetch(this.POST_URL, {
            method: 'POST',
            body: formData,
        });
        //   .then((res) => res.json())
        //   .then((res) => {
        //     console.log(res);
        //   })
        //   .catch((error) => {
        //     console.error('Error:', error);
        //   });
    }
    changeUrl(url) {
        this.GET_URL = url;
    }
    load(projectId, session, ip, cb) {
        fetch(`${this.GET_URL}/${projectId}/${session}/${ip}`)
            .then((res) => {
            return res.json();
        })
            .then((res) => {
            if (cb) {
                cb(res);
            }
        });
    }
}
