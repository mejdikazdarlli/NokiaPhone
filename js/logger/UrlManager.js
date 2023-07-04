export class UrlManager {
    constructor() {
        this.setBaseUrl = (url) => {
            console.log('url', url)
            this.BASE_URL = url;
        };
        this.getBaseUrl = () => {
            return this.BASE_URL;
        };
    }
    static getInstance() {
        if (!UrlManager.instance) {
            UrlManager.instance = new UrlManager();
        }
        return UrlManager.instance;
    }
}
