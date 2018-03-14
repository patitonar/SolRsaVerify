/* global artifacts */
/* global contract */
/* global web3 */
/* global assert */

/*
https://csrc.nist.gov/CSRC/media/Projects/Cryptographic-Algorithm-Validation-Program/documents/dss/186-2rsatestvectors.zip file SigVer15_186-3.rsp
*/

const SolRsaVerify = artifacts.require("../contracts/SolRsaVerify.sol");
const crypto = require('crypto');

contract("SolRsaVerify", (accounts) => {

    let v

    beforeEach(async () => {
        v = await SolRsaVerify.new();
    });

    verify = async (_data,_s,_e,_n) => {
        const sha256 = crypto.createHash('sha256').update(Buffer.from(_data, 'hex')).digest().toString('hex')
        return (await v.pkcs1Sha256Verify("0x"+sha256,"0x"+_s,"0x"+_e,"0x"+_n)).toNumber()
    }

    /*
    n = a911245a2cfb33d8ee375df9439f74e669c03a8d9acad25bd27acf3cd8bea7eb9dbe470155c7c72782c94861f7b573cd325639fb070e9ba6e621991aefa45106182e4d264be7068035595d7549052989b3e7fd04cabc94012c1278a0ef8672b1a51dd1a9e276816ba497dea24b4febe3dd8e977707bcd230ca6fb6f8a8bff9e6ba24fbadcd93f00126b19b396a38e6ef86d18fef945b9154c1963fb488c7025953511f86d05638bfe056493730bc6778446e59cd3c5c3acf07a0a3a64943793652f10e3292aa7a6d25a03181cc6f6ba0658d909e59ce2a02bacc9766fd8c4fbd4ed9c23a866844b8a794d49e505f9f944870a71aadbe5338039825c2dff81af3
    p = bf96de108963b5113399b664765efe046e2dafdb70d6e5e29dc6ec89b789b059348d74d89129c7ade9ddb404c6dc3a3437c7fc9f23bc38dadc8ffd0ff757999f5c2d510b993056147ccdf421e03d0be2c74ec333a9677c430cc604f5550d0d86defdde71488e3db889c699a5cacb44dcdae2f3cca38695e783e6f6250827efb1
    q = e1e7e33618d1b64d6862c132e4b1cd5fabad20ce62bd97bce2a3f5ad2da67bb0a7f0b9e48335a33b7b95e77ec4c47e91416881f9f7c23f9bc1918cc644335c74260e90cd7b2e0fed802f19e78c5ed80a431b38630d82f982c74a0381b8ecf943c60810fae90574e216357b2535002316d9529cb56420f3cc82dea37cb624e1e3
    */

    let n = "a8d68acd413c5e195d5ef04e1b4faaf242365cb450196755e92e1215ba59802aafbadbf2564dd550956abb54f8b1c917844e5f36195d1088c600e07cada5c080ede679f50b3de32cf4026e514542495c54b1903768791aae9e36f082cd38e941ada89baecada61ab0dd37ad536bcb0a0946271594836e92ab5517301d45176b5"

    /*
    SHAAlg = SHA256
    e = 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001
    d = 252c4956ac328ba04789bfdc5e90819981a100f3b540069ba8719b8b3ba27980cc7c96710a75ec0da83c1ddf353b45845f3db7224cdecbe5653cebb01fb66305d42e617e8a51514c6d2fb6b3cbe3ad9478ab7acb575f854ec9c9576a70c63934921c39662b32b8c93fb660f64f50e5481892a8ef4b92a64774995f2a0fbd64b9
    Msg = ff23e00f819bae424e41d6b762ea6b88801e651c831c964af31de0c1d6dda4a7c8587d804ed12f526819da06650e7412fb627555979ed442f2663341e5fe57527e0ddaf453a124451674976a6a6e0a31f56a79f5b73dfac39af4f3ba4a5e8bb846cb5e333812756482d975ab1910162f96bfd7c58a02f113125189f5ac05291f
    S = 8b5a3675f397841c53a9021dad71a1efab91451c71ad7060ce85d75b306d6403ba23d3370b0695be87485cf6680204c68424bc7e442ef90ac01c4df420ef574294823250a000d56a5d00947800dcb2f4947f5b4eb18fa1dbdc6ab16be4b7131102d4dff98ddeac38554473964d29cdc521ee690cde5a8cd16889aa090c32c53e
    SaltVal = 00
    Result = F (1 - Message changed)
    */

   it("FIPS 186-3 - Message changed", async () => {

        const e = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001"
        const Msg = "ff23e00f819bae424e41d6b762ea6b88801e651c831c964af31de0c1d6dda4a7c8587d804ed12f526819da06650e7412fb627555979ed442f2663341e5fe57527e0ddaf453a124451674976a6a6e0a31f56a79f5b73dfac39af4f3ba4a5e8bb846cb5e333812756482d975ab1910162f96bfd7c58a02f113125189f5ac05291f"
        const S = "8b5a3675f397841c53a9021dad71a1efab91451c71ad7060ce85d75b306d6403ba23d3370b0695be87485cf6680204c68424bc7e442ef90ac01c4df420ef574294823250a000d56a5d00947800dcb2f4947f5b4eb18fa1dbdc6ab16be4b7131102d4dff98ddeac38554473964d29cdc521ee690cde5a8cd16889aa090c32c53e"

        assert.equal(5,await verify(Msg,S,e,n))
    
    });

    /*
    SHAAlg = SHA256
    e = 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001
    d = 252c4956ac328ba04789bfdc5e90819981a100f3b540069ba8719b8b3ba27980cc7c96710a75ec0da83c1ddf353b45845f3db7224cdecbe5653cebb01fb66305d42e617e8a51514c6d2fb6b3cbe3ad9478ab7acb575f854ec9c9576a70c63934921c39662b32b8c93fb660f64f50e5481892a8ef4b92a64774995f2a0fbd64b9
    Msg = a6ce108ff3100b953781496c3d081fe32b8cedaf6d14aab2ef2dc37d8f8d2613d2f599efd55c51498749c0961681ae4ea7e28bf14a8f044c2d4dd4f9102ddd25f86c7795289708eb4df2d526f91b176952eb52fd0c9de2989432d6e08e13022b82f95089d20a5704f0452f26cd1f83bc956ee7da99876c1f8da3723af388bead
    S = 750e59f29d2dfeedab2a3a09034904715957149126c63e6a2dc7a633a32c4c0561d54eeb1479cb65274bac37cac4751f4dffdfb7530171599b61d94862845f6cd12a5e0bd6adabc36f06d216a00b1942349710540555106aeb87f5cf3f78df918f36cf63291ef2a7064e31b84075d1c8b551225a25f59c721a3d77046078557f
    SaltVal = 00
    Result = F (3 - Signature changed )
    */

   it("FIPS 186-3 - Signature changed", async () => {

        const e = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001"
        const Msg = "a6ce108ff3100b953781496c3d081fe32b8cedaf6d14aab2ef2dc37d8f8d2613d2f599efd55c51498749c0961681ae4ea7e28bf14a8f044c2d4dd4f9102ddd25f86c7795289708eb4df2d526f91b176952eb52fd0c9de2989432d6e08e13022b82f95089d20a5704f0452f26cd1f83bc956ee7da99876c1f8da3723af388bead"
        const S = "750e59f29d2dfeedab2a3a09034904715957149126c63e6a2dc7a633a32c4c0561d54eeb1479cb65274bac37cac4751f4dffdfb7530171599b61d94862845f6cd12a5e0bd6adabc36f06d216a00b1942349710540555106aeb87f5cf3f78df918f36cf63291ef2a7064e31b84075d1c8b551225a25f59c721a3d77046078557f"

        assert.equal(1,await verify(Msg,S,e,n))

    });

    /*
    SHAAlg = SHA256
    e = 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003
    Msg = 9be28a4763c6665880c1c2a8a74494622be46de3c20e5b118cf70fee51d33b6d0b473e84a4200382004526a33eea59e13b07070e580937207ec7b2cc5fb76856fe6210a771150fa0e5da9baee4a6209ed3d4e2b3bfd2e5f6591b0ace3e657ad07c1b47d8520d5159386767f11fdfaf41fa3348fb7dd32d3c25da5d1d78433985
    S = 0ac6e41252383ee5d07f4fb08a22204f56440a8f3c8568d6e6bae46cfc9d39b65b2eae827164d716e9e465301d08fca7356ef447e0699feabbfac16ed19dc9233b457fe64d6fab38aca4464e5cd3eae3f43bab17856cdcc942e2cc848b7bf390fc53b3ed2e6f63c5d961bc83475ac200708f6e1d5be30cbe24fe4d3dad754269
    SaltVal = 00
    Result = F (2 - Public Key e changed )
    */

    it("FIPS 186-3 - Public Key e changed", async () => {

        const e = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001"
        const d = "252c4956ac328ba04789bfdc5e90819981a100f3b540069ba8719b8b3ba27980cc7c96710a75ec0da83c1ddf353b45845f3db7224cdecbe5653cebb01fb66305d42e617e8a51514c6d2fb6b3cbe3ad9478ab7acb575f854ec9c9576a70c63934921c39662b32b8c93fb660f64f50e5481892a8ef4b92a64774995f2a0fbd64b9"
        const Msg = "a6ce108ff3100b953781496c3d081fe32b8cedaf6d14aab2ef2dc37d8f8d2613d2f599efd55c51498749c0961681ae4ea7e28bf14a8f044c2d4dd4f9102ddd25f86c7795289708eb4df2d526f91b176952eb52fd0c9de2989432d6e08e13022b82f95089d20a5704f0452f26cd1f83bc956ee7da99876c1f8da3723af388bead"
        const S = "750e59f29d2dfeedab2a3a09034904715957149126c63e6a2dc7a633a32c4c0561d54eeb1479cb65274bac37cac4751f4dffdfb7530171599b61d94862845f6cd12a5e0bd6adabc36f06d216a00b1942349710540555106aeb87f5cf3f78df918f36cf63291ef2a7064e31b84075d1c8b551225a25f59c721a3d77046078557f"

        assert.equal(1,await verify(Msg,S,e,n))

    });
   
    /*
    SHAAlg = SHA256
    e = 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001
    Msg = f56379c42e3ba856585ca28f7fb768f65d273a5fc546156142857b0afb7c72d2d97ecfceec71b4260bdc58c9bb42065f53af69805d9006233ec70a591aff463bf23d78200fb8cc14a4eba286afe8924120efad9e3d3f06f7452c725e53728b8f86c9fb245fbaf7086ab0092e215213830d1091212efc1ec59ddc3a83707d4ab8
    S = 5f49d8dc4519d9520d6542eca08cafb2d99cdb97c5a8685df2476b40505a2f9e8d63d76516b83481e2d961a7e8dc5f9f46887e394776711b0f85e4303065c06d362456bc219fc6eb343ede6733f779f75853533bc9ab876188da8ad98f9ea2f335d2ceec34ef9cb2782bb0f79cad309608ddc222e00ebcff9d14f6e6ed39638b
    SaltVal = 00
    Result = P
    */

    it("FIPS 186-3 - Passed ok", async () => {

        const e   = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001"
        const Msg = "f56379c42e3ba856585ca28f7fb768f65d273a5fc546156142857b0afb7c72d2d97ecfceec71b4260bdc58c9bb42065f53af69805d9006233ec70a591aff463bf23d78200fb8cc14a4eba286afe8924120efad9e3d3f06f7452c725e53728b8f86c9fb245fbaf7086ab0092e215213830d1091212efc1ec59ddc3a83707d4ab8"
        const S   = "5f49d8dc4519d9520d6542eca08cafb2d99cdb97c5a8685df2476b40505a2f9e8d63d76516b83481e2d961a7e8dc5f9f46887e394776711b0f85e4303065c06d362456bc219fc6eb343ede6733f779f75853533bc9ab876188da8ad98f9ea2f335d2ceec34ef9cb2782bb0f79cad309608ddc222e00ebcff9d14f6e6ed39638b"

        assert.equal(0,await verify(Msg,S,e,n))

    });

    it("FIPS 186-3 - Passed ok (raw message)", async () => {

        const e   = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001"
        const Msg = "f56379c42e3ba856585ca28f7fb768f65d273a5fc546156142857b0afb7c72d2d97ecfceec71b4260bdc58c9bb42065f53af69805d9006233ec70a591aff463bf23d78200fb8cc14a4eba286afe8924120efad9e3d3f06f7452c725e53728b8f86c9fb245fbaf7086ab0092e215213830d1091212efc1ec59ddc3a83707d4ab8"
        const S   = "5f49d8dc4519d9520d6542eca08cafb2d99cdb97c5a8685df2476b40505a2f9e8d63d76516b83481e2d961a7e8dc5f9f46887e394776711b0f85e4303065c06d362456bc219fc6eb343ede6733f779f75853533bc9ab876188da8ad98f9ea2f335d2ceec34ef9cb2782bb0f79cad309608ddc222e00ebcff9d14f6e6ed39638b"

        const result = (await v.pkcs1Sha256VerifyRaw("0x"+Msg,"0x"+S,"0x"+e,"0x"+n)).toNumber()

        assert.equal(0,result)

    });


    /*
    SHAAlg = SHA256
    e = 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001
    d = 252c4956ac328ba04789bfdc5e90819981a100f3b540069ba8719b8b3ba27980cc7c96710a75ec0da83c1ddf353b45845f3db7224cdecbe5653cebb01fb66305d42e617e8a51514c6d2fb6b3cbe3ad9478ab7acb575f854ec9c9576a70c63934921c39662b32b8c93fb660f64f50e5481892a8ef4b92a64774995f2a0fbd64b9
    Msg = 399b54f756514628f32ce8f1cf391d77047af55f3d43804923e5e09a188aa27f28604f2f3cfa3d7091f3ab5c69d40d650137a597c22d531dbbdeae074f6f534a2b297e087cd7d7125e6f8eac97f5a990859d9d3555301c5076b02f9c4d3f84d62b3d090c7cb1ba1841eab668c066990079f206c15d1383eb3ba58ae17bc2dc2c
    S = a62e4b688bb3c4c2e11a3a0b1ef81ff4bbaa110c9b830d02bda2d364dadb2345a8c5dca58c611515f0c09732ee6a6642d5c5c339460a9d15022f48c36e9bc2fb8b2b0ff99005273287b8c3bed87993baf52f0e9d079281bc25a8694ed9692446127c26c34f21e610a84f3617247ecfb3b5337fe59d1239dfb7fdac8694dbef0b
    SaltVal = 00
    EM with hash moved = 0001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff003031300d060960864801650304020105000420be1f73a059cec568dcdfddf1daff4201e79273653f88ef8f16be7e9ee660335aefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefef
    Result = F (4 - Format of the EM is incorrect - hash moved to left )
    */

   it("FIPS 186-3 - Format of the EM is incorrect - hash moved to left", async () => {

        const e   = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001"
        const Msg = "399b54f756514628f32ce8f1cf391d77047af55f3d43804923e5e09a188aa27f28604f2f3cfa3d7091f3ab5c69d40d650137a597c22d531dbbdeae074f6f534a2b297e087cd7d7125e6f8eac97f5a990859d9d3555301c5076b02f9c4d3f84d62b3d090c7cb1ba1841eab668c066990079f206c15d1383eb3ba58ae17bc2dc2c"
        const S   = "a62e4b688bb3c4c2e11a3a0b1ef81ff4bbaa110c9b830d02bda2d364dadb2345a8c5dca58c611515f0c09732ee6a6642d5c5c339460a9d15022f48c36e9bc2fb8b2b0ff99005273287b8c3bed87993baf52f0e9d079281bc25a8694ed9692446127c26c34f21e610a84f3617247ecfb3b5337fe59d1239dfb7fdac8694dbef0b"

        assert.equal(2,await verify(Msg,S,e,n))

    });

    /*
    SHAAlg = SHA256
    e = 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001
    d = 252c4956ac328ba04789bfdc5e90819981a100f3b540069ba8719b8b3ba27980cc7c96710a75ec0da83c1ddf353b45845f3db7224cdecbe5653cebb01fb66305d42e617e8a51514c6d2fb6b3cbe3ad9478ab7acb575f854ec9c9576a70c63934921c39662b32b8c93fb660f64f50e5481892a8ef4b92a64774995f2a0fbd64b9
    Msg = b8518b80a55b365eb1850e18f88da2941c99543c2f865df3d37d114d9fc764ffc5e2ae94f2d4ab6276bfc6bda5b6976a7dcfaa56897982880410dd5542af3ad34c469990cbec828327764842ef488f767c6b0c8cd1e08caec63438f2665517d195a4d4daf64bc2a70bd11d119eec93a060960245d162844c5f11a98cd26003e1
    S = 06317d3df0fa7ae350729ae2096b050dcec8909d36681ccca09a7a527b90767f8c2318c49e09483b48df77ddb632d6ca721155165389f7795d3ede70465678649399242aed6d984ca74fc6c2eb4dd4bb2cd7bf2125ec853f2bf757d665b29487bc5b63df0d0b03b18608d3d9a7576ea0954aef3d3303f7d8fd7e7f9725c114e2
    SaltVal = 00
    EM with trailer wrong =0001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff443031300d060960864801650304020105000420a51c139e5ff91509eb0bd542bebfb9a4baa9399a5535d9168942298ce69c4f5b
    Result = F (5 - Format of the EM is incorrect - 00 on end of pad removed )
    */

   it("FIPS 186-3 - Format of the EM is incorrect - 00 on end of pad removed", async () => {

        const e   = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001"
        const Msg = "b8518b80a55b365eb1850e18f88da2941c99543c2f865df3d37d114d9fc764ffc5e2ae94f2d4ab6276bfc6bda5b6976a7dcfaa56897982880410dd5542af3ad34c469990cbec828327764842ef488f767c6b0c8cd1e08caec63438f2665517d195a4d4daf64bc2a70bd11d119eec93a060960245d162844c5f11a98cd26003e1"
        const S   = "06317d3df0fa7ae350729ae2096b050dcec8909d36681ccca09a7a527b90767f8c2318c49e09483b48df77ddb632d6ca721155165389f7795d3ede70465678649399242aed6d984ca74fc6c2eb4dd4bb2cd7bf2125ec853f2bf757d665b29487bc5b63df0d0b03b18608d3d9a7576ea0954aef3d3303f7d8fd7e7f9725c114e2"

        assert.equal(3,await verify(Msg,S,e,n))

    });

});




