import { getIP, getUserInformation, uuidv4 } from './Utility.js';
import { LogManager } from './LogManager.js';


export class Logger {
    constructor(projectId) {
        this.logs = [];
        this.projectId = projectId;
    }
    init(object, interval) {
        this.object = object;
        this.interval = interval;
        this.logManager = new LogManager();
        getIP((ip) => {
            this.sessionData = Object.assign({ session: uuidv4(), project_uuid: this.projectId, log_file: JSON.stringify(this.logs), IP: ip }, getUserInformation());
            this.logManager.upload(this.sessionData);
        });
        this.start();
        this.updateSessionInterval = window.setInterval(() => {
            this.updateSessionData();
        }, 15000);
    }
    start() {
        this.timer = window.setInterval(() => {
            const log = {
                time: new Date().getTime(),
                translation: {
                    position: { x: this.object.position.x, y: this.object.position.y, z: this.object.position.z },
                    rotation: { x: this.object.rotation.x, y: this.object.rotation.y, z: this.object.rotation.z },
                },
            };
            this.logs.push(log);
        }, this.interval);
    }
    stop() {
        window.clearInterval(this.timer);
        window.clearInterval(this.updateSessionInterval);
    }
    updateSessionData() {
        const sessionData = Object.assign(Object.assign({}, this.sessionData), { log_file: JSON.stringify(this.logs) });
        this.logManager.upload(sessionData);
    }
}
