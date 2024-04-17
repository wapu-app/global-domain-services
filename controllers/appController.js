const Irys = require("@irys/sdk");
const Query = require("@irys/query").Query;

const get_irys = async () => {
  const key = {
    kty: process.env.WALLET_KTY,
    n: process.env.WALLET_N,
    e: process.env.WALLET_E,
    d: process.env.WALLET_D,
    p: process.env.WALLET_P,
    q: process.env.WALLET_Q,
    dp: process.env.WALLET_DP,
    dq: process.env.WALLET_DQ,
    qi: process.env.WALLET_QI,
  };

  const irys_instance = new Irys({
    network: process.env.IRYS_SDK_NETWORK,
    token: process.env.IRYS_SDK_TOKEN,
    key: key,
  });

  const myQuery = new Query({ network: process.env.IRYS_QUERY_NETWORK });

  return { irys_instance, myQuery };
};

const parseTransaction = (trx) => {
  for (var i = 0; i < trx.tags.length; i++) {
    tag = trx.tags[i];
    trx[tag.name] = tag.value;
  }
};

exports.user = async (req, res) => {
  const data = req.body;
  const userdomain = data.userdomain;
  const irys_instance = (await get_irys()).irys_instance;

  const dataToUpload = JSON.stringify(data);
  const tags = [
    { name: "app", value: "wapu" },
    { name: "Content-Type", value: "application/json" },
    { name: "userdomain", value: userdomain },
    { name: "uploaded_at", value: Date.now().toString() },
  ];

  try {
    const receipt = await irys_instance.upload(dataToUpload, { tags: tags });

    res.json({ arweave_link: `https://arweave.net/${receipt.id}` });
  } catch (e) {
    res.json({ error: e });
  }
};

exports.search = async (req, res) => {
  const userdomain = req.body.userdomain;

  const myQuery = (await get_irys()).myQuery;
  try {
    const results = await myQuery
      .search("arweave:transactions")
      .tags([
        { name: "app", values: ["wapu"] },
        { name: "Content-Type", values: ["application/json"] },
        { name: "userdomain", values: [userdomain] },
      ])
      .fields({
        id: true,
        tags: {
          name: true,
          value: true,
        },
      })
      .from([process.env.IRYS_OWNER_ADDRESS]);

    if (results.length == 0) {
      res.json({});
    } else {
      results.forEach((element) => {
        parseTransaction(element);
      });

      let current_trx = results[0];
      for (var i = 1; i < results.length; i++) {
        if (
          parseInt(current_trx.uploaded_at) < parseInt(results[i].uploaded_at)
        ) {
          current_trx = results[i];
        }
      }

      let response = await fetch("https://arweave.net/" + current_trx.id);
      let data = await response.json();
      res.json({ response: data });
    }
  } catch (e) {
    res.json({ error: e });
  }
};
