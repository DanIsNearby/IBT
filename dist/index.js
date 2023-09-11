// 1.Import lisk sdk to create the blockchain application
const {
	Application,
	configDevnet,
	genesisBlockDevnet,
	HTTPAPIPlugin,
	utils,
} = require('lisk-sdk');

// 2.Import IBT module and Plugin
const { IBTModule } = require('./ibt_module');
const { IBTAPIPlugin } = require('./ibt_api_plugin');

// 3.Update the genesis block accounts to include NFT module attributes
genesisBlockDevnet.header.timestamp = 1605699440;
genesisBlockDevnet.header.asset.accounts = genesisBlockDevnet.header.asset.accounts.map(
	(a) =>
		utils.objects.mergeDeep({}, a, {
			ibt: {
				ownIBTs: [],
			},
		}),
);

// 4.Update application config to include unique label
// and communityIdentifier to mitigate transaction replay
const appConfig = utils.objects.mergeDeep({}, configDevnet, {
	label: 'ibt-app',
	genesisConfig: { communityIdentifier: 'IBT' }, //In order to have a unique networkIdentifier
	logger: {
		consoleLogLevel: 'info',
	},
});

// 5.Initialize the application with genesis block and application config
const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

// 6.Register custom IBT Module and Plugins
app.registerModule(IBTModule);
app.registerPlugin(HTTPAPIPlugin);
app.registerPlugin(IBTAPIPlugin);

// 7.Run the application
app
	.run()
	.then(() => console.info('IBT Blockchain running....'))
	.catch(console.error);