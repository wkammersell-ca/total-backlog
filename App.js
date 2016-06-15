Ext.define('CustomApp', {
	extend: 'Rally.app.App',
	componentCls: 'app',

	launch: function() {
		Ext.create('Rally.data.wsapi.TreeStoreBuilder').build({
			models: ['defect', 'userstory'],
			autoLoad: true,
			enableHierarchy: true,
			sorters:[{
				property:'Rank',
				direction: 'ASC'
			}],
			filters:[
				{
					property: 'ScheduleState',
					operator: '!=',
					value: 'Released'
				}
			]
		}).then({
			success: this._onStoreBuilt,
			scope: this
		});
	},

	_onStoreBuilt: function(store) {
		var modelNames = ['defect', 'userstory'],
		context = this.getContext();
		this.add({
			xtype: 'rallygridboard',
			context: context,
			modelNames: modelNames,
			toggleState: 'grid',
			stateful: false,
			plugins: [
				'rallygridboardaddnew',
				{
					ptype: 'rallygridboardfieldpicker',
					headerPosition: 'left',
					modelNames: modelNames,
					stateful: true,
					stateId: context.getScopedStateId('columns-example')
				},{
					ptype: 'rallygridboardinlinefiltercontrol',
					inlineFilterButtonConfig: {
						stateful: true,
						stateId: context.getScopedStateId('filters'),
						modelNames: modelNames,
						inlineFilterPanelConfig: {
							quickFilterPanelConfig: {
								defaultFields: [
									'ArtifactSearch',
									'Owner',
									'ModelType'
								]
							}
						}
					}
				}
			],
			gridConfig: {
				store: store,
				columnCfgs: [
					'Name',
					'PlanEstimate',
					'KanbanState',
					'Release',
					'Iteration'
				]
			},
			height: this.getHeight()
		});
	}
});
