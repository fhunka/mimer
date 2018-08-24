import React, {Fragment} from "react";

import moment from 'moment';

import 'brace/theme/github';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/ext/language_tools';

import {
  EuiEmptyPrompt,
  EuiHeader,
  EuiHeaderBreadcrumbs,
  EuiHeaderSection,
  EuiHeaderLinks,
  EuiHeaderLink,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiHeaderLogo,
  EuiIcon,
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiText,
  EuiBasicTable,
  EuiLink,
  EuiHealth,
  EuiSwitch,
  EuiSpacer,
  EuiDatePicker,
  EuiFormRow,
  EuiCodeEditor,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCodeBlock,
  EuiFieldText,
  EuiForm,
  EuiRange,
  EuiFlexGrid,
  EuiFormHelpText,
  EuiSearchBar,
  EuiToast,
  EuiGlobalToastList
} from "@elastic/eui";

const initialQuery = "{\n  \"query\": {\n    \"match_all\": {}\n  }\n}";

let toastId = 0;

export class QueryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		query: "{}",
		valid: false,
		value: '3',
		item_exists: false,
		item_index: "",
		item_type: "",
		item_id: "",
		item: {
			index: "logstash-*",
			datetime: moment(),
			timestamp: moment().valueOf(),
			updated_at: moment(),
			name: "",
			query: initialQuery,
			severity: '3',
			valid: false,
			active: false,
			scheduled: false
		},
		toasts: []
	};

	this.levels = [
		{
	        min: 7,
	        max: 10,
	        color: 'danger'
	      },
	      {
	        min: 3,
	        max: 6,
	        color: 'success'
	      },
		{
	        min: 0,
	        max: 3,
	        color: 'warning'
	      }
	    ];

	this.handleIndex = this.handleIndex.bind(this);
	this.handleName = this.handleName.bind(this);
	this.handleQuery = this.handleQuery.bind(this);
	this.handleActive = this.handleActive.bind(this);
	this.handleScheduled = this.handleScheduled.bind(this);
  }

  componentDidMount() {
    /* 
       FOR EXAMPLE PURPOSES ONLY.  There are much better ways to
       manage state and update your UI than this.
    */
    const { httpClient } = this.props;
    const { params } = this.props;
    const { windows } = this.props;

	if ( params.name ) {
		console.log("Get item");
		this.getQuery("saved-search", "query", params.name);	
	}
	
  }

  removeToast = (removedToast) => {
    this.setState(prevState => ({
      toasts: prevState.toasts.filter(toast => toast.id !== removedToast.id),
    }));
  };

  addToast = (obj) => {
    //const toast = this.getRandomToast();

    const toast = {
	  id: toastId++,
      ...obj,
    };

    this.setState({
      toasts: this.state.toasts.concat(toast),
    });
  };

  getRandomToast = () => {
    const toasts = [{
      title: `Check it out, here's a really long title that will wrap within a narrower browser`,
      text: (
        <Fragment>
          <p>
            Here&rsquo;s some stuff that you need to know. We can make this text really long so that,
            when viewed within a browser that&rsquo;s fairly narrow, it will wrap, too.
          </p>
          <p>
            And some other stuff on another line, just for kicks. And <EuiLink href="#">here&rsquo;s a link</EuiLink>.
          </p>
        </Fragment>
      ),
    }];

  };

  //ACTIONS
  onChange = e => {
	console.log(e.target.value);
	const item = this.state.item;
	item.severity = e.target.value;
    this.setState({
      value: e.target.value,
    });
	this.setState({item});
  };

	handleIndex = (index) => {
	    const item = this.state.item;

	        item.index = index.target.value;

	    this.setState({ index, item });
	    console.log({item});
	  };

  handleName = (name) => {
    const item = this.state.item;

        item.name = name.target.value;

    this.setState({ name, item });
    console.log({item});
  };

  handleQuery = (query) => {
    const item = this.state.item;

	item.query = query;
	
    this.setState({ query, item });
    console.log({item});
  };

  handleActive = (value) => {

	const item = this.state.item;
	item.active = value.target.checked;
	this.setState( { item } );
  };

  handleScheduled = (value) => {
	const item = this.state.item;
	item.scheduled = value.target.checked;
	this.setState( { item } );
 };

  getQuery(index, type, id) {
	
	var data = { 
		"index": index,
		"type": type,
		"id": id
   	};
	
	this.props.httpClient.post("../api/jag_testar_ett_plugin/queries_get", data).then((resp) => {
		//const item = this.state.item;
		console.log("Found item");
		console.log(resp.data.resp._source);
		//var item = resp.data.resp._source;
		
		this.setState({
			item: resp.data.resp._source,
			item_exists: true,
			item_index: resp.data.resp._index,
			item_type: resp.data.resp._type,
			item_id: resp.data.resp._id
			});
		
	}).catch((e) => {
		console.log(e);
	});
  };

  saveQuery = (button) => {

	const item = this.state.item;
	item.updated_at = moment();

   var data = {
	params: item
   };
   var config = {};

    this.props.httpClient.post("../api/jag_testar_ett_plugin/queries2", data ).then((resp) => {
      
  	console.log("---");
	console.log(resp);  
	this.setState({
          btnSave: "Save",
          btnSaveLoading: false
        });

	this.props.windows.location.href = '#/queries';

	}).catch((e) => {
	this.setState({
        btnSave: "Error",
        btnSaveLoading: false
    });
		console.log(e);
	});

  };

  updateQuery = (button) => {
	
	const item = this.state.item;
	const item_index = this.state.item_index;
	const item_type = this.state.item_type;
	const item_id = this.state.item_id;
	
	item.updated_at = moment();

  	var data = {
		"index": item_index,
		"type": item_type,
		"id": item_id,
		"body": { 
			"doc": {
				"index": "logstash-*",
                        "updated_at": moment(),
                        "name": item.name,
                        "query": item.query,
                        "severity": item.severity,
                        "valid": item.valid,
                        "active": item.active,
                        "scheduled": item.scheduled
			}
		}
	};

	var config = {};
	
	this.props.httpClient.post("../api/jag_testar_ett_plugin/queries_update", data ).then((resp) => {
        	console.log("Item updated");
	}).catch((e) => {
		console.log(e);
        });

  };

	validateQuery = (button) => {

	const item = this.state.item;

	var data = {
		"index": item.index,
		"query": item.query
	};
	
	var config = {};

    this.props.httpClient.post("../api/jag_testar_ett_plugin/queries_validate", data ).then((resp) => {

  	console.log("---");
	console.log(resp); 
	
	if(resp.data.ok == true){
		//const item = this.state.item
		item.valid = resp.data.resp.valid;

		this.setState({
			valid: resp.data.resp.valid,
			item
		});
		
		this.addToast({ "title": "success", "text": "Valid query" });
		
	} else {
		this.addToast({"title": "Error", "text": resp.data.resp.msg });
	}

	}).catch((e) => {
	//this.setState({
    //    btnSave: "Error",
    //    btnSaveLoading: false
    //});
		this.addToast({"title": "error", "text": "Error" });
		console.log(e);
	});

  };

  renderLogo() {
    return (
      <EuiHeaderLogo href="#/" aria-label="Go to home page">App</EuiHeaderLogo>
    );
  };


  renderBreadcrumbs() {
    const breadcrumbs = [{
      text: 'Overview',
      href: '#',
      onClick: (e) => { e.preventDefault(); console.log('You clicked management'); },
      'data-test-subj': 'breadcrumbsAnimals',
      className: 'customClass',
    }, {
      text: 'Queries',
      href: '#',
      onClick: (e) => { e.preventDefault(); console.log('You clicked truncation test'); },
    }, {
      text: 'hiddens',
      href: '#',
      onClick: (e) => { e.preventDefault(); console.log('You clicked hidden'); },
    }, {
      text: 'Create',
    }];

    return (
      <EuiHeaderBreadcrumbs breadcrumbs={breadcrumbs} />
    );
  } 

	render() {

    const { title } = this.props;
	const { query } = this.state;
	
	const valid = this.state.valid;
	const item_exists = this.state.item_exists;
	
	const {item} = this.state;

	return (
      <EuiPage>
        <EuiHeader>
            <EuiHeaderSectionItem border="right">
              {this.renderLogo()}
            </EuiHeaderSectionItem>

	<EuiHeaderLinks>
          <EuiHeaderLink href="#/issues">
            Issues
          </EuiHeaderLink>

          <EuiHeaderLink href="#/schedules">
            Schedules
          </EuiHeaderLink>

          <EuiHeaderLink iconType="help" href="#/queries" isActive>
            Queries
          </EuiHeaderLink>
        </EuiHeaderLinks>

        </EuiHeader>

<EuiSpacer />

        <EuiPageHeader>
          <EuiTitle size="l">
            <h1>{title}</h1>
          </EuiTitle>
        </EuiPageHeader>


        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiTitle>
                <h1>Queries</h1>
              </EuiTitle>
            </EuiPageContentHeader>
	    <EuiPageContentBody>
		
		<div>
		    <Fragment>


			<EuiForm>
				

					<EuiFlexGroup>
						<EuiFlexItem>
							<EuiFormRow
								fullWidth
								label="Index"
								helpText="I am some friendly help text."
								>
								<EuiFieldText value={item.index} fullWidth name="index" onChange={this.handleIndex} />
							</EuiFormRow>
						</EuiFlexItem>
						<EuiFlexItem>
							<EuiFormRow
								fullWidth
								label="Name"
								helpText="I am some friendly help text."
								>
								<EuiFieldText value={item.name} fullWidth name="name" onChange={this.handleName} />
							</EuiFormRow>
						</EuiFlexItem>
						
						<EuiFlexItem>
							<EuiFlexGrid columns={3}>
							     <EuiFlexItem>
									<EuiFormRow
										fullWidth
										label="Active"
										helpText="Only active queries are pulled."
										>
										<EuiSwitch 
											id="active"
											name={"asd"} 
											onChange={this.handleActive} 
											checked={item.active}
											/>
									</EuiFormRow>
								</EuiFlexItem>
								<EuiFlexItem>
									<EuiFormRow
								fullWidth
								label="Scheduled"
								helpText="Scheduled queries are repeated."
								>
								<EuiSwitch 
									id="scheduled"
									name={"sch"} 
									onChange={this.handleScheduled} 
									checked={item.scheduled}
								/>
							</EuiFormRow>
						</EuiFlexItem>
						
						<EuiFlexItem>
							<EuiFormRow
								fullWidth
								label="Severity"
								helpText="Severity if matches are found."
								>
								<Fragment>
								<EuiRange
									fullWidth
								          id="range"
								          min={1}
								          max={10}
								          step={1}
								          value={item.severity}
								          onChange={this.onChange}
								          aria-label="Use aria labels when no actual label is in use"
								          aria-describedby="levelsHelp"
								        />
								</Fragment>
							</EuiFormRow>
						</EuiFlexItem>
						</EuiFlexGrid>
						</EuiFlexItem>
					</EuiFlexGroup>
				
					<EuiFlexGroup>
						<EuiFlexItem>
						<EuiFormRow label="Query" 
						fullWidth
						>
				<EuiCodeEditor
		        mode="javascript"
		        theme="github"
		        width="100%"
		        value={item.query}
		        onChange={this.handleQuery}
		        setOptions={{
		          fontSize: '14px',
		          enableBasicAutocompletion: true,
		          enableSnippets: true,
		          enableLiveAutocompletion: true,
		        }}
		        onBlur={() => { console.log('blur'); }} // eslint-disable-line no-console
		      />
		</EuiFormRow>
						</EuiFlexItem>
						<EuiFlexItem>
						<EuiFormRow label="Formatted query" 
						fullWidth
						>
							<EuiCodeBlock language="js">
				              { JSON.stringify(item, Object.keys(item).sort(), 2) }
				            </EuiCodeBlock>
				</EuiFormRow>
						</EuiFlexItem>
					</EuiFlexGroup>
		  	
				<EuiFlexGroup>
					<EuiFlexItem grow={false}>
					
						{item_exists ? (
							<div>
								<EuiButton
								  fill
								  isDisabled={!valid}
									onClick={this.updateQuery}
						        >
									Update
						        </EuiButton>
							</div>
						) : (

					<div>
					<EuiButton
					  fill
					  isDisabled={!valid}
						onClick={this.saveQuery}
			        >
						Save
			        </EuiButton>
					</div>
					)}
					
					        
					      </EuiFlexItem>

					      <EuiFlexItem grow={false}>
					        <EuiButton
					          fill
								color="secondary"
								onClick={this.validateQuery}
					        >
								Validate
					        </EuiButton>
					      </EuiFlexItem>
				</EuiFlexGroup>
				
			</EuiForm>
			</Fragment>
		</div>

		
		<EuiGlobalToastList
		        toasts={this.state.toasts}
		        dismissToast={this.removeToast}
		        toastLifeTimeMs={6000}
		      />
		
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
	);
	}
  
};
