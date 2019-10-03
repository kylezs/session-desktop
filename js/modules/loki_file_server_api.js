const LokiAppDotNetAPI = require('./loki_app_dot_net_api');

const DEVICE_MAPPING_ANNOTATION_KEY = 'network.loki.messenger.devicemapping';

// returns the LokiFileServerAPI constructor with the serverUrl already consumed
function LokiFileServerAPIWrapper(serverUrl) {
  return LokiFileServerAPI.bind(null, serverUrl);
}

class LokiFileServerAPI {
  constructor(serverUrl, ourKey) {
    this.ourKey = ourKey;
    this._adnApi = new LokiAppDotNetAPI(ourKey);
    this._server = this._adnApi.findOrCreateServer(serverUrl);
  }

  async getUserDeviceMapping(pubKey) {
    const annotations = await this._server.getUserAnnotations(pubKey);
    return annotations.find(
      annotation => annotation.type === DEVICE_MAPPING_ANNOTATION_KEY
    );
  }

  setOurDeviceMapping(authorisations, isPrimary) {
    const content = {
      isPrimary: isPrimary ? '1' : '0',
      authorisations,
    };
    return this._server.setSelfAnnotation(
      DEVICE_MAPPING_ANNOTATION_KEY,
      content
    );
  }
}

module.exports = LokiFileServerAPIWrapper;