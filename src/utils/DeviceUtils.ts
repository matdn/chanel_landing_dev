export class DeviceUtils {

    private static readonly _MobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    public static IsMobileDevice():boolean {
        const userAgent = navigator.userAgent;
        return this._MobileRegex.test(userAgent);
    }
}