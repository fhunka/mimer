import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import {
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
  EuiSpacer
} from "@elastic/eui";

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.items = [];
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
    console.log(params);
    httpClient.get("../api/jag_testar_ett_plugin/example").then((resp) => {
      //this.setState({ time: resp.data.time });
      //this.setState([ rra: resp.data.resp.hits.hits ]);
	this.items = resp.data.resp.hits.hits;
      //this.setStastore = resp;

      this.setState({rr: resp.data.resp.hits.total })
    });  
  }

  renderLogo() {
    return (
      <EuiHeaderLogo href="#/" aria-label="Go to home page">App</EuiHeaderLogo>
    );
  }


  renderBreadcrumbs() {
    const breadcrumbs = [{
      text: 'Management',
      href: '#',
      onClick: (e) => { e.preventDefault(); console.log('You clicked management'); },
      'data-test-subj': 'breadcrumbsAnimals',
      className: 'customClass',
    }, {
      text: 'Truncation test is here for a really long item',
      href: '#',
      onClick: (e) => { e.preventDefault(); console.log('You clicked truncation test'); },
    }, {
      text: 'hidden',
      href: '#',
      onClick: (e) => { e.preventDefault(); console.log('You clicked hidden'); },
    }, {
      text: 'Users',
      href: '#',
      onClick: (e) => { e.preventDefault(); console.log('You clicked users'); },
    }, {
      text: 'Create',
    }];

    return (
      <EuiHeaderBreadcrumbs breadcrumbs={breadcrumbs} />
    );
  }

  render() {
//console.log(this.state.rra);
    const { title } = this.props;
    //const items = [{"a": "abc123"}];
    const items = this.items;
    const columns = [
{
  field: '_id',
  name: 'vip',
  render: (name) => (
    <EuiIcon type={'starEmpty'} />
),
},
{   
    field: '_source.@timestamp',
    name: 'Date',
    sortable: true,
    hideForMobile: true,
    'data-test-subj': 'firstNameCell',
    render: (name) => (
      <EuiLink href={'#/?a=' + name}>{name}</EuiLink>
    ),
  },
{
    field: '_id',
    name: 'First Name',
    sortable: true,
    hideForMobile: true,
    'data-test-subj': 'firstNameCell',
    render: (name) => (
      <EuiLink href={'#/?a=' + name}>{name}</EuiLink>
    ),
  },
  {
    field: '_id',
    name: 'status',
    render: (name) => (
      <EuiSwitch />
    ),
  }
];

  const getRowProps = (item) => {
	console.log(item);
    const { _id } = item;
    return {
      'data-test-subj': `row-${_id}`,
      className: 'customRowClass',
      onClick: () => console.log(`Clicked row ${_id}`),
    };
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
        
        <EuiPageBody>
      
      <EuiHeader>
          <EuiHeaderSectionItem border="right">
            {this.renderLogo()}
          </EuiHeaderSectionItem>

<EuiHeaderLinks>
        <EuiHeaderLink href="#/issues" isActive>
          Issues ads ads
        </EuiHeaderLink>

        <EuiHeaderLink href="#/schedules">
          Schedules
        </EuiHeaderLink>

        <EuiHeaderLink iconType="help" href="#/queries">
          Queries
        </EuiHeaderLink>
      </EuiHeaderLinks>

      </EuiHeader>
      <EuiPageHeader>
        <EuiTitle size="l">
          <h1>{title} Hello World!</h1>
        </EuiTitle>
      </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiTitle>
                <h1>Issues</h1>
              </EuiTitle>
            </EuiPageContentHeader>
            
{this.renderBreadcrumbs()}
<EuiPageContentBody>
              <EuiText>
<p>{ this.state.rr }</p>
                <h3>You've successfully created your first Kibana Plugin!</h3>
                <p>The server time (via API call) is {this.state.time || "NO API CALL YET"}</p>
              </EuiText>
              <EuiBasicTable
      items={items}
      columns={columns}
      rowProps={getRowProps}
      cellProps={getCellProps}
    />
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
  
};
