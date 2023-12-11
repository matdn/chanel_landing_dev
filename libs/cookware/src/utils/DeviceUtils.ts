export class DeviceUtils {

    private static _IsMobile: boolean;

    public static Init() {

        const testExp = new RegExp('Android|webOS|iPhone|iPad|' +
            'BlackBerry|Windows Phone|' +
            'Opera Mini|IEMobile|Mobile',
            'i');
        if (testExp.test(navigator.userAgent)) {
            this._IsMobile = true;
        } else {
            this._IsMobile = false;
        }
    }

    public static get IsMobile() {this.Init(); return this._IsMobile; }
}