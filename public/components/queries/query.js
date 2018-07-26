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
  EuiFormHelpText
} from "@elastic/eui";

export class QueryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		query: "{}",
		valid: false,
		value: '3',
		item: {
			timestamp: moment(),
			updated_at: moment(),
			name: "",
			query: "{}",
			severity: '3',
			valid: false,
			active: false,
			scheduled: false
		}
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

	
  }

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
	const item = this.state.item
	item.active = value.target.checked;
	this.setState( { item } );
  };

  handleScheduled = (value) => {
	const item = this.state.item
	item.scheduled = value.target.checked;
	this.setState( { item } );
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
		"query": this.state.query
	};
	
	var config = {};

    this.props.httpClient.post("../api/jag_testar_ett_plugin/queries_validate", data ).then((resp) => {

  	console.log("---");
	console.log(resp); 

	const item = this.state.item
	item.valid = resp.data.resp.valid;
 
	this.setState({
		valid: resp.data.resp.valid,
		item
	});

	}).catch((e) => {
	//this.setState({
    //    btnSave: "Error",
    //    btnSaveLoading: false
    //});
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
								<EuiFieldText fullWidth name="name" onChange={this.handleName} />
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
								<EuiFlexItem grow={false}>
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
								          id="range"
								          min={0}
								          max={10}
								          step={1}
								          value={this.state.value}
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
		</EuiFormRow>
						</EuiFlexItem>
						<EuiFlexItem>
						<EuiFormRow label="Formatted query" 
						fullWidth
						>
							<EuiCodeBlock language="json">
				              { JSON.stringify(item) }
				            </EuiCodeBlock>
				</EuiFormRow>
						</EuiFlexItem>
					</EuiFlexGroup>
		  	
				<EuiFlexGroup>
					<EuiFlexItem grow={false}>
					        <EuiButton
							  fill
							  isDisabled={!valid}
								onClick={this.saveQuery}
					        >
								Save
					        </EuiButton>
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
		
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
	);
	}
  
};
