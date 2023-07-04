import { Logger } from './Logger.js'
import { UrlManager } from './UrlManager.js'
import { UUID, apiUrl } from './config.js'


export class SetLogger {
    constructor(camera) {
        this.camera = camera
        this.projectUUID = UUID
        this.setServerUrl();
        this.init()
    }
    init() {
        this.logger = new Logger(this.projectUUID)
        this.logger.init(this.camera, 1000)
    }
    setServerUrl() {
        let serverUrl = apiUrl
        UrlManager.getInstance().setBaseUrl(serverUrl)
      }
}
