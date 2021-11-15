import {downloadPdfs} from "./downloadPdfs"
import {updateApi} from "./updateApi"

const main = async () => {
    await downloadPdfs(90)
    updateApi()
}

main()