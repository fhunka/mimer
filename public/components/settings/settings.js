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

export class Setting extends React.Component {
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
		toasts: [],
    tier1: "[]",
    tier2: "[]",
    tier3: "[]"
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
		this.getQuery("queries", "doc", params.name);	
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

	console.log(this.state.toasts.concat(toast));
	console.log(toast);

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
	
	this.props.httpClient.post("../api/jag_testar_ett_plugin/doc_get", data).then((resp) => {
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
	settings: {
		"_index": "queries",
		"_type": "doc"
	},
	params: item
   };
   var config = {};

    this.props.httpClient.post("../api/jag_testar_ett_plugin/doc_index", data ).then((resp) => {
      
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
	
	this.props.httpClient.post("../api/jag_testar_ett_plugin/doc_update", data ).then((resp) => {
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
	
	if(resp.data.ok == true) {
		//const item = this.state.item
		item.valid = resp.data.resp.valid;

		this.setState({
			valid: resp.data.resp.valid,
			item
		});
		
		if( item.valid == false) {
			this.addToast({ "title": "Not Valid", "text": "Invalid query", "color": "warning", "iconType": "alert" });
		}
		
	} else {
		this.addToast({"title": "Error", "text": resp.data.resp.msg, "color": "danger", "iconType": "alert" });
	}

	}).catch((e) => {
	//this.setState({
    //    btnSave: "Error",
    //    btnSaveLoading: false
    //});
		this.addToast({"title": "error", "text": "Error", "color": "danger", "iconType": "alert" });
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
	
  const tier1 = this.state.tier1;
  const tier2 = this.state.tier2;
  const tier3 = this.state.tier3;
  
	const {item} = this.state;

	return (
      <EuiPage>
        


        <EuiPageBody>
        <EuiHeader>
            <EuiHeaderSectionItem border="right">
              {this.renderLogo()}
            </EuiHeaderSectionItem>

	<EuiHeaderLinks>
          <EuiHeaderLink iconType="apps" href="#/issues">
            Issues
          </EuiHeaderLink>

          <EuiHeaderLink iconType="calendar" href="#/schedules">
            Schedules
          </EuiHeaderLink>

          <EuiHeaderLink iconType="help" href="#/queries" isActive>
            Queries
          </EuiHeaderLink>
          <EuiHeaderLink iconType="gear" href="#/settings" isActive>
            Settings
          </EuiHeaderLink>
        </EuiHeaderLinks>

        </EuiHeader>

<EuiSpacer />

        <EuiPageHeader>
          <EuiTitle size="l">
            <h1>{title}</h1>
          </EuiTitle>
        </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiTitle>
                <h1>Settings</h1>
              </EuiTitle>
            </EuiPageContentHeader>
	    <EuiPageContentBody>
		
		<div>
		    <Fragment>


			<EuiForm>
				

					<EuiFlexGroup>
						<EuiFlexItem>
              <EuiTitle size="xs">
                <h3>Tier 1 categories</h3>
              </EuiTitle>
							<EuiText>asd</EuiText>
						</EuiFlexItem>
              
            <EuiFlexItem>
              
							<EuiFormRow
								fullWidth
								label="Index"
								helpText="I am some friendly help text."
								>
  				<EuiCodeEditor
  		        mode="javascript"
  		        theme="github"
  		        width="100%"
  		        value={tier1}
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
              
					</EuiFlexGroup>
              
					<EuiFlexGroup>
						<EuiFlexItem>
              <EuiTitle size="xs">
                <h3>Tier 1 categories</h3>
              </EuiTitle>
							<EuiText>asd</EuiText>
						</EuiFlexItem>
              
            <EuiFlexItem>
              
							<EuiFormRow
								fullWidth
								label="Index"
								helpText="I am some friendly help text."
								>
  				<EuiCodeEditor
  		        mode="javascript"
  		        theme="github"
  		        width="100%"
  		        value={tier2}
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
              
					</EuiFlexGroup>
              
					<EuiFlexGroup>
						<EuiFlexItem>
              <EuiTitle size="xs">
                <h3>Tier 1 categories</h3>
              </EuiTitle>
							<EuiText>asd</EuiText>
						</EuiFlexItem>
              
            <EuiFlexItem>
              
							<EuiFormRow
								fullWidth
								label="Index"
								helpText="I am some friendly help text."
								>
  				<EuiCodeEditor
  		        mode="javascript"
  		        theme="github"
  		        width="100%"
  		        value={tier3}
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
