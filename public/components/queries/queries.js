import React, {Fragment} from "react";

import moment from 'moment';

import 'brace/theme/github';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/ext/language_tools';

import { Test } from './test.js';

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
  EuiFlexItem,
  EuiCodeBlock,
  EuiFieldText,
  EuiForm
} from "@elastic/eui";

export class QueryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    //this.items = [];

    this.state = {
      startDate: moment(),
      value: '',
      btnSave: "Save",
      btnSaveLoading: false,
      jsCode: "{}",
      checked: false,
      items: [],
      pageIndex: 0,
      pageSize: 50,
      sortField: '_source.active',
      sortDirection: 'desc',
      pageOfItems: [],
      totalItemCount: 0,
      index_exists: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handTextChange = this.handleTextChange.bind(this);
    this.saveQuery = this.saveQuery.bind(this);

   //this.handleChecked = this.handleChecked.bind(this);
  }

  componentDidMount() {
    /* 
       FOR EXAMPLE PURPOSES ONLY.  There are much better ways to
       manage state and update your UI than this.
    */
    //const { handle } = this.props.match.params;
    const { httpClient } = this.props;
    const { params } = this.props;
    //const { store } = this.props;
    //console.log(params);
	this.getQueries(this.state.pageIndex, this.state.pageSize, this.state.sortField, this.state.sortDirection);
    //httpClient.get("../api/jag_testar_ett_plugin/queries").then((resp) => {
      //this.setState({ time: resp.data.time });
      //this.setState([ rra: resp.data.resp.hits.hits ]);
	//TODO: Add exception to empty list
    //	if ( resp.data.statusCode == 404 ){
//		this.state.items = [{}];
//	} else {
//		this.state.items = resp.data.resp.hits.hits;
  //    	}
	
	//this.setStastore = resp;

    //  this.setState({rr: resp.data.resp.hits.total })
   // });  
  }


onTableChange = ({ page = {}, sort = {} }) => {
    const {
      index: pageIndex,
      size: pageSize,
    } = page;

    const {
      field: sortField,
      direction: sortDirection,
    } = sort;

    this.setState({
      pageIndex,
      pageSize,
      sortField,
      sortDirection,
    });

    this.getQueries(pageIndex,pageSize,sortField,sortDirection);

  };

  handleChange(date) {
    this.setState({
      startDate: date
    });
  };

  handleTextChange = (value) => {
    this.setState({ value });
    //console.log({value});
  };


  handleChecked = (value) => {
	//pageOfItems
	const items = this.state.pageOfItems
	items[this.state.pageOfItems.map(item => item._id).indexOf(value.target.name)]._source.active = value.target.checked;
	this.setState({items});
	this.updateDocument(items[this.state.pageOfItems.map(item => item._id).indexOf(value.target.name)]);
  };

  handleCheckedScheduled = (value) => {
  	//this.test({});
	const items = this.state.pageOfItems
        items[this.state.pageOfItems.map(item => item._id).indexOf(value.target.name)]._source.scheduled = value.target.checked;
        //const item = items[this.state.items.map(item => item._id).indexOf(value.target.name)];
	//console.log(items); 
        this.setState({items});

	this.updateDocument(items[this.state.pageOfItems.map(item => item._id).indexOf(value.target.name)]);
	//this.test; 
 };


  saveQuery = (button) => {
    //console.log({button});

	this.setState({
        btnSave: "Loading",
        btnSaveLoading: true,
        jsCode: this.state.value
    });

   //checkedChange = (e) => {
   // this.setState({
   //   checked: e.target.checked,
   // });
   //};

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
      //this.setState({ time: resp.data.time });
      //this.setState([ rra: resp.data.resp.hits.hits ]);
      //  this.items = resp.data.resp.hits.hits;
      //this.setStastore = resp;
      //this.setState({rr: resp.data.resp.hits.total })
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

  updateDocument(item) {

	console.log("Update item:");
	console.log(item);

  	var data = {
		"index": item._index,
		"type": item._type,
                "id": item._id,
                "body": { 
			"doc": {
				"active": item._source.active,
				"scheduled": item._source.scheduled,
				"updated_at": moment()
			}
		}
        };

	//console.log(data);

	var config = {};

	this.props.httpClient.post("../api/jag_testar_ett_plugin/doc_update", data ).then((resp) => {
        	console.log("Item updated");
	}).catch((e) => {
		console.log(e);
        });

  };

  getQueries(pageIndex, pageSize, sortField, sortDirection) {



	console.log(sortField + " | " + this.state.pageIndex + " getting queries: " + pageIndex + " | " + pageSize);
	//console.log(pageIndex);
	//console.log(pageSize);
	//console.log(sortField);
	//console.log(sortDirection);

	//return { "items":[], "total": 10 }
//const this.props.totalItemCount = 100;
	//this.setState({
	//	pageOfItems: [],
	//	totalItemCount: 10
	//});


	let hits, total;


	var test = [];

	var tmp = {};
	tmp[sortField.split(".")[1]] = { "order": sortDirection }
	
	test.push(tmp);

	var data = { 
        	params: {
                	"from": pageIndex,
                	"size": pageSize,
			"sort": test //[{ String(sortField) : { "order": sortDirection  }}]
		 }
   	};

	//console.log(data);

	this.props.httpClient.post("../api/jag_testar_ett_plugin/doc_list", data).then((resp) => {
      //this.setState({ time: resp.data.time });
      //this.setState([ rra: resp.data.resp.hits.hits ]);
        console.log("resp");
	console.log(resp);

	if ( resp.data.resp.statusCode ) {
		console.log(resp.data.resp.statusCode);
	} else {
		console.log("index exists");
		this.setState({
                        "pageOfItems": resp.data.resp.hits.hits,
                        "totalItemCount": resp.data.resp.hits.total
                });
	}
        //TODO: Add exception to empty list
                //this.state.items = resp.data.resp.hits.hits;
    		//hits = resp.data.resp.hits.hits;
		//total = resp.data.resp.hits.total;
		
	//hits = resp.data.resp.hits.hits;
	//total = resp.data.resp.hits.total;	

	//console.log(hits);
        //console.log(total);
		
	//return "testes";
	
		//this.setState({
              	//	"pageOfItems": resp.data.resp.hits.hits,
            	//	"totalItemCount": resp.data.resp.hits.total
        	//});

	});


//	console.log(total);
//console.log(a);
	//return {
	//	"pageOfItems": this.state.pageOfItems,
	//	"totalItemCount": this.state.totalItemCount
	//}  
};
 

cloneQuery = query => {
    //store.cloneUser(user.id);
    //this.setState({ selectedItems: [] });
    console.log("Clone: " + query);
  };
 
  deleteQuery = item => {
    //store.deleteUsers(user.id);
    //this.setState({ selectedItems: [] });
    console.log("Delete: " + item._id);

    const items = this.state.pageOfItems
   
 
        var data = {
                "index": item._index,
                "type": item._type,
                "id": item._id,
        };
        
        
        var config = {};
        
        this.props.httpClient.post("../api/jag_testar_ett_plugin/doc_delete", data ).then((resp) => {
                console.log("Item updated");
		console.log(this.state.pageOfItems.map(item => item._id).indexOf(item._id));
	        items.splice(this.state.pageOfItems.map(item => item._id).indexOf(item._id),1);
		this.setState({items});
        }).catch((e) => {
                console.log(e);
        });

 
    //console.log(this.state.pageOfItems.map(item => item._id).indexOf(item._id));    
    //items.splice(this.state.pageOfItems.map(item => item._id).indexOf(item._id),1);
        //this.setState({items});
        //this.updateDocument(items[this.state.pageOfItems.map(item => item._id).indexOf(value.target.name)]);

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

  EmptyIndex() {

    return (
	<EuiEmptyPrompt
    iconType="editorStrike"
    title={<h2>You have no queries</h2>}
    body={
      <Fragment>
        <p>
          Navigators use massive amounts of spice to gain a limited form of prescience.
          This allows them to safely navigate interstellar space, enabling trade and travel throughout the galaxy.
        </p>
        <p>You&rsquo;ll need spice to rule Arrakis, young Atreides.</p>
      </Fragment>
    }
    //actions={<Test httpClient={this.props.httpClient}/>}
    actions={<EuiButton fill href="#/queries/new">
          Create a Query
        </EuiButton>}
  />
    );
  };


  render() {
//console.log(this.state.rra);
    const { pageIndex, pageSize, sortField,
      sortDirection} = this.state;
    const { title } = this.props;
    //const items = [{"a": "abc123"}];
    const pageOfItems = this.state.pageOfItems;
    const totalItemCount = this.state.totalItemCount;
    const index_exists = this.state.index_exists;
    
    //const {
    //  pageOfItems,
    //  totalItemCount
    //} = this.getQueries(pageIndex, pageSize, sortField, sortDirection);

   const actions = [{
      name: 'Clone',
      description: 'Clone this person',
      icon: 'copy',
      onClick: this.cloneQuery
    }, {
      name: 'Delete',
      description: 'Delete this person',
      icon: 'trash',
      color: 'danger',
      onClick: this.deleteQuery
    }];

    const columns = [
//{
//  field: '_id',
//  name: 'vip',
//  sortable: true,
//  render: (name) => (
//    <EuiIcon type={'starEmpty'} />
//  ),
//},
{   
    field: '_source.datetime',
    name: 'Created at',
    sortable: true,
    hideForMobile: true,
    'data-test-subj': 'firstNameCell',
    render: (name) => (
      <EuiLink href={'#/?a=' + name}>{name}</EuiLink>
	),
  },
{
    field: '_source.updated_at',
    name: 'Updated at',
    sortable: true,
    hideForMobile: true,
    'data-test-subj': 'firstNameCell',
    render: (name) => (
      <EuiLink href={'#/?a=' + name}>{name}</EuiLink>
        ),
  },
{
    field: '_source.name',
    name: 'Name',
    hideForMobile: true,
    'data-test-subj': 'firstNameCell',
    render: (name, item) => (
      <EuiLink href={'#/query/' + item._id}>{name}</EuiLink>
    ),
  },
  {
    field: '_source.active',
    name: 'Active',
    sortable: true,
    dataType: 'boolean',
    render: (active, item) => (
      	<EuiSwitch 
			id={item._id + "_active"}
			name={item._id} 
			onChange={this.handleChecked} 
			checked={active}
			/>
    	),
  },
  {
    field: '_source.scheduled',
    name: 'Scheduled',
    dataType: 'boolean',
    sortable: true,
    render: (scheduled, item) => (
      <EuiSwitch 
	id={item._id + "_scheduled"}
	name={item._id}
	onChange={this.handleCheckedScheduled} 
	checked={scheduled}
	/>
    ),
  },
  {
      name: 'Actions',
      actions  
  }
];

  const getRowProps = (item) => {
	//console.log(item);
    const { _id } = item;
    return {
      'data-test-subj': `row-${_id}`,
      className: 'customRowClass',
      onClick: () => console.log(`Clicked row ${_id}`),
    };
  };

const pagination = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      totalItemCount: totalItemCount,
      pageSizeOptions: [50, 100]
    };

const sorting = {
      sort: {
        field: sortField,
        direction: sortDirection,
      },
    };

const getCellProps = (item, column) => {
    const { id } = item;
    const { field } = column;
    return {
      className: 'customCellClass',
      'data-test-subj': `cell-${id}-${field}`,
    };
  };


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
	{pageOfItems.length ==  0 ? (
		<div>{this.EmptyIndex()}<Test/></div>
	) : (

<div>
  <EuiButton fill iconType={'plusInCircle'} href="#/queries/new">
          Create a Query
        </EuiButton>
	<EuiSpacer />
              <EuiBasicTable
      items={pageOfItems}
      id="id"
      columns={columns}
      sorting={sorting}
      pagination={pagination}
      rowProps={getRowProps}
      cellProps={getCellProps}
      hasActions={true}
      onChange={this.onTableChange}
      //onPageChange={console.log("test")}
    />
</div>
)}
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>


    );
  }
  
};
