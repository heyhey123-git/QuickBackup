class JsonConfig {
    constructor(path, defultValue = {}) {
        this.mData = defultValue;
        this.mPath = path;
        this.init();
    }

    init() {
        if (File.exists(this.mPath)) {
            let existDataStr = File.readFrom(this.mPath);
            existDataStr = existDataStr.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
            try {
                this.mData = Object.assign(
                    {},
                    this.mData,
                    JSON.parse(existDataStr)
                );
            } catch {
                let newPath = this.mPath + "_old";
                File.rename(this.mPath, newPath);
            }
        }
        this.save();
    }

    save(format = 4) {
        let dataStr = JSON.stringify(this.mData, null, format);
        File.writeTo(this.mPath, dataStr);
    }

    getData() {
        return this.mData;
    }

    get(key, defultValue = undefined) {
        let result = this.getData()[key];
        if (!result && defultValue != undefined) {
            this.set(key, defultValue);
            return defultValue;
        }
        return result;
    }

    set(key, value) {
        this.getData()[key] = value;
        this.save();
    }

    delete(key) {
        delete this.getData()[key];
        this.save();
    }
}

module.exports = {
    JsonConfig
};
