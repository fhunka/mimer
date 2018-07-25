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
  EuiRange
} from "@elastic/eui";

export class QueryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		query: ""
	};

	this.handleQuery = this.handleQuery.bind(this);
  }

  componentDidMount() {
    /* 
       FOR EXAMPLE PURPOSES ONLY.  There are much better ways to
       manage state and update your UI than this.
    */
    const { httpClient } = this.props;
    const { params } = this.props;

  }

  //ACTIONS
  handleQuery = (query) => {
    this.setState({ query });
    //console.log({value});
  };

  handleActive = (value) => {
	//pageOfItems
	//const items = this.state.pageOfItems
	//items[this.state.pageOfItems.map(item => item._id).indexOf(value.target.name)]._source.active = value.target.checked;
	//this.setState({items});
	//this.updateDocument(items[this.state.pageOfItems.map(item => item._id).indexOf(value.target.name)]);
  };

  handleScheduled = (value) => {
  	//this.test({});
	//const items = this.state.items
    //    items[this.state.items.map(item => item._id).indexOf(value.target.name)]._source.scheduled = value.target.checked;
    //    //const item = items[this.state.items.map(item => item._id).indexOf(value.target.name)];
	////console.log(item); 
    //    this.setState({items});
    //
	//this.updateDocument(items[this.state.items.map(item => item._id).indexOf(value.target.name)]);
	//this.test; 
 };

  saveQuery = (button) => {

   var data = {
	params: {
		"timestamp": moment(),
		"updated_at": moment(),
		"name": "test" + moment(),
		"query": "{}",
		"active": true,
		"scheduled": true
	}
   };
   var config = {};

    this.props.httpClient.post("../api/jag_testar_ett_plugin/queries2", data ).then((resp) => {
      
  	console.log("---");
	console.log(resp);  
	this.setState({
          btnSave: "Save",
          btnSaveLoading: false
        });

	}).catch((e) => {
	this.setState({
        btnSave: "Error",
        btnSaveLoading: false
    });
		console.log(e);
	});

  };

  validateQuery = (button) => {

   var data = {
	params: {
		"timestamp": moment(),
		"updated_at": moment(),
		"name": "test" + moment(),
		"query": "{}",
		"active": true,
		"scheduled": true
	}
   };
   var config = {};

    this.props.httpClient.post("../api/jag_testar_ett_plugin/queries2", data ).then((resp) => {

  	console.log("---");
	console.log(resp);  
	this.setState({
          btnSave: "Save",
          btnSaveLoading: false
        });

	}).catch((e) => {
	this.setState({
        btnSave: "Error",
        btnSaveLoading: false
    });
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
	
	const active = true;
	const scheduled = true;
	
	const item = { "_id": 1 }

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
        <EuiPageHeader>
          <EuiTitle size="l">
            <h1>{title}</h1>
          </EuiTitle>
	{this.renderBreadcrumbs()}
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
								label="Name"
								helpText="I am some friendly help text."
								>
								<EuiFieldText fullWidth name="name" />
							</EuiFormRow>
						</EuiFlexItem>
						
						<EuiFlexItem grow={false}>
							<EuiFormRow
								fullWidth
								label="Name"
								helpText="I am some friendly help text."
								>
								<EuiSwitch 
									id={item._id + "_active"}
									name={item._id} 
									onChange={this.handleActive} 
									checked={active}
									/>
							</EuiFormRow>
						</EuiFlexItem>
						
						<EuiFlexItem grow={false}>
							<EuiFormRow
								fullWidth
								label="Name"
								helpText="I am some friendly help text."
								>
								<EuiSwitch 
									id={item._id + "_scheduled"}
									name={item._id} 
									onChange={this.handleScheduled} 
									checked={scheduled}
								/>
							</EuiFormRow>
						</EuiFlexItem>
						
						<EuiFlexItem>
							<EuiFormRow
								fullWidth
								label="Name"
								helpText="I am some friendly help text."
								>
								<EuiRange
									min={0}
									max={10}
									name="range"
									id="range"
								/>
							</EuiFormRow>
						</EuiFlexItem>
						
					</EuiFlexGroup>


				<EuiFormRow label="Query" 
				fullWidth
				>
				
					<EuiFlexGroup>
						<EuiFlexItem>
				<EuiCodeEditor
		        mode="javascript"
		        theme="github"
		        width="100%"
		        value={this.state.query}
		        onChange={this.handleQuery}
		        setOptions={{
		          fontSize: '14px',
		          enableBasicAutocompletion: true,
		          enableSnippets: true,
		          enableLiveAutocompletion: true,
		        }}
		        onBlur={() => { console.log('blur'); }} // eslint-disable-line no-console
		      />
						</EuiFlexItem>
						<EuiFlexItem>
							<EuiCodeBlock language="json">
				              {JSON.stringify(query)}
				            </EuiCodeBlock>
						</EuiFlexItem>
					</EuiFlexGroup>
		  	</EuiFormRow>

			</EuiForm>
			</Fragment>
		</div>
		
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
	);
	}
  
};
