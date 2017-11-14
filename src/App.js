import React from 'react';
import {clericData} from './cleric.data';
import {wizardData} from './wizard.data'
import {schools, sources} from './constants';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Multiselect } from 'react-widgets';


const spellLvl = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9
};
// class Table extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             name: 'Click on row',
//             desc: 'To see descritpion',
//             data: wizardData,
//             href: '',
//             type: 'wizard'
//         };
//     }
//     onNavClick = (type) => {
//       if (type === 'cleric') {
//           this.setState({data: clericData, type: type});
//       } else {
//           this.setState({data: wizardData, type: type});
//       }
//     };
//     isActive = (type) => {
//       return type === this.state.type ? 'active' : '';
//     };
//     onRowSelect = (row, isSelected, e) => {
//         this.setState({name: row.name, desc: row.description, href: row.link})
//     };
//     selectRowProp = {
//         mode: 'radio',
//         clickToSelect: true,
//         bgColor: 'rgb(255, 237, 182)',
//         onSelect: this.onRowSelect
//     };
//     render() {
//         return (
//             <div>
//                 <nav className="navbar navbar-expand-lg navbar-light bg-light">
//                     <img src="./book.svg" alt=""/>
//                     <a className="navbar-brand" href="#">3.5 SpellBook</a>
//                     <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//
//                     <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                         <ul className="navbar-nav mr-auto">
//                             <li className={`nav-item ${this.isActive('wizard')}`}>
//                                 <a className="nav-link" href="#" onClick={ () => this.onNavClick('wizard') }>Wizard <span className="sr-only">(current)</span></a>
//                             </li>
//                             <li className={`nav-item ${this.isActive('cleric')}`}>
//                                 <a className="nav-link" href="#" onClick={ () => this.onNavClick('cleric') }>Cleric</a>
//                             </li>
//                         </ul>
//                     </div>
//                 </nav>
//             <BootstrapTable data={ this.state.data } scrollTop={ 'Top' } selectRow={ this.selectRowProp }>
//                 {/*<TableHeaderColumn dataField='link' width='30' dataFormat={ hrefFormatter }>#</TableHeaderColumn>*/}
//                 <TableHeaderColumn dataField='name' width='200' filter={ { type: 'TextFilter', delay: 100 } } isKey>Name</TableHeaderColumn>
//                 <TableHeaderColumn dataField='lvl' width='60' filter={ { type: 'SelectFilter', options: spellLvl, defaultValue: 0} }>Lvl</TableHeaderColumn>
//                 {/*<TableHeaderColumn dataField='type' width='80' filter={ { type: 'TextFilter', defaultValue: 'wizard', delay: 100 } }>Type</TableHeaderColumn>*/}
//                 <TableHeaderColumn dataField='school' filter={ { type: 'SelectFilter', options: schools, delay: 100 } }>School</TableHeaderColumn>
//                 <TableHeaderColumn dataField='castTime'>Casting Time</TableHeaderColumn>
//                 <TableHeaderColumn dataField='range'>Spell range</TableHeaderColumn>
//                 <TableHeaderColumn dataField='duration'>Duration</TableHeaderColumn>
//                 <TableHeaderColumn dataField='savingThrow'>Saving throw</TableHeaderColumn>
//                 <TableHeaderColumn dataField='spellResist'>Spell resist</TableHeaderColumn>
//                 <TableHeaderColumn dataField='target'>Target</TableHeaderColumn>
//                 <TableHeaderColumn dataField='area'>Area</TableHeaderColumn>
//                 <TableHeaderColumn dataField='components'>Components</TableHeaderColumn>
//                 <TableHeaderColumn dataField='source' filter={ { type: 'SelectFilter', options: sources, delay: 100 } }>Source</TableHeaderColumn>
//                 {/*<TableHeaderColumn dataField='effect'>Effect</TableHeaderColumn>*/}
//             </BootstrapTable>
//                 <div className="col-md-12 desc">
//                     <h2><a href={this.state.href} target="_blank">{this.state.name}</a></h2>
//                     {this.state.desc}
//                 </div>
//             </div>
//         );
//     }
// }

class Tr extends React.Component{

}
class Table extends React.Component {
    constructor() {
        super();
        this.state = {
            data: wizardData.filter(item => item.lvl === '0'),
            show: []
        };
        // console.log(this.state);
        // let a = this.state.data.map((item) => {
        //     console.log(item);
        //     return item;
        // });
    }
    l() {
        this.setState({data: wizardData.filter(item => item.lvl === '1')});
    }
    withoutBrackets(item) {
        return item.split('(')[0];
    }
    getShowClass(name) {
        const className = 'spell-more';
        return this.state.show.includes(name) ? className : `${className} hidden`;
    }
    showHide(name) {
        let newShowArray = [];
        if (this.state.show.includes(name)) {
            newShowArray = this.state.show.filter(item => item !== name);
        } else {
            newShowArray = [...this.state.show, name];
        }
        this.setState({show: newShowArray});
    }
    getResistClass(prop) {
        const className = 'resist cell';
        return prop.includes('Yes') ? `${className} text-success` : `${className} text-danger`;
    }
    render () {
        return (
            <div className="spell-content wrapper">
                {/*<div className="spell-content">*/}
                    {/*<button onClick={()=>this.l()} className="btn btn-primary">*/}
                        {/*Lolo*/}
                    {/*</button>*/}
                {/*</div>*/}
                <div className="header-wrapper">
                    <div className="lvl header">
                        Lvl
                    </div>
                    <div className="name header">
                        Name
                    </div>
                    <div className="range header">
                        Range
                    </div>
                    <div className="duration header">
                        Duration
                    </div>
                    <div className="target header">
                        Target
                    </div>
                    <div className="saveThrow header">
                        Save
                    </div>
                    <div className="resist header">
                        Resist
                    </div>
                </div>

                    {this.state.data.map((item) =>
                        <div key={item.name} className="spell">
                            <div className="spell-content" onClick={() => this.showHide(item.name)}>
                                <div className="lvl lvl-content cell"><small>{item.lvl}</small></div>
                                <div className="name cell">
                                    <a href={item.link} target="_blank">{item.name}</a> <br/>
                                    <small>
                                        ({item.school},{item.components})
                                    </small>
                                </div>
                                <div className="range cell">{this.withoutBrackets(item.range)}</div>
                                <div className="duration cell">{item.duration}</div>
                                <div className="target cell">{item.target}</div>
                                <div className="saveThrow cell">{this.withoutBrackets(item.savingThrow)}</div>
                                <div className={this.getResistClass(item.spellResist)}>{this.withoutBrackets(item.spellResist)}</div>
                            </div>
                            <div className={this.getShowClass(item.name)}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <span className="section-header">
                                            Range
                                        </span><br/>
                                        {item.range}
                                    </div>
                                    <div className="col-md-3">
                                        <span className="section-header">
                                            Duration
                                        </span><br/>
                                        {item.duration}
                                    </div>
                                    <div className="col-md-3">
                                        <span className="section-header">
                                            Target
                                        </span><br/>
                                        {item.target}
                                    </div>
                                    <div className="col-md-3">
                                        <span className="section-header">
                                            Save
                                        </span><br/>
                                        {item.savingThrow}
                                    </div>
                                    <div className="col-md-3">
                                        <span className="section-header">
                                            Spell resist
                                        </span><br/>
                                        {item.spellResist}
                                    </div>
                                    <div className="col-md-3">
                                        <span className="section-header">
                                            Cast time
                                        </span><br/>
                                        {item.castTime}
                                    </div>
                                    <div className="col-md-3">
                                        <span className="section-header">
                                            Area
                                        </span><br/>
                                        {item.area}
                                    </div>
                                    <div className="col-md-3">
                                        <span className="section-header">
                                            Source book
                                        </span><br/>
                                        {item.source}
                                    </div>
                                </div>
                                <div className="bordered-top">
                                    {item.description}
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        )
    }
}
export default Table