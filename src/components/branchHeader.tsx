import * as React from 'react';
import ToggleDisplay from 'react-toggle-display'
import {
  Widget
} from '@phosphor/widgets';

import {
  Dialog, showDialog
} from '@jupyterlab/apputils';

import {
  Git
} from '../git'

import '../../style/index.css';

export namespace BranchHeader {
  export
  interface IState {
    top_repo_path: string;
    current_repo_branch:string;
    data: any;
    refresh:any;
    disabled:boolean;
    show_notice:boolean;
  }

  export
  interface IProps {
    current_fb_path:string;
    top_repo_path: string;
    current_branch: string;
    data:any;
    refresh: any;  
    disabled: boolean;
  }
}
export class BranchHeader extends React.Component<BranchHeader.IProps, BranchHeader.IState>{
  interval:any;
  constructor(props: BranchHeader.IProps) {
    super(props);
    this.state = {top_repo_path: props.top_repo_path, current_repo_branch: props.current_branch, data: [], refresh:props.refresh, disabled:props.disabled, show_notice:false}
  }

//functions for switch branches
  switch_branch(event, refresh){
    let git_temp = new Git();
    if(event.target.value==''){
      let input = new Widget({ node: document.createElement('input') });
        showDialog({        
          title: 'Input a name to create a new branch and switch to it:',
          body: input,
          buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Create'})]
        }).then(result => {
          let target_branch = (input.node as HTMLInputElement).value ;
          if (result.button.accept&&target_branch) {
            git_temp.checkout(true, true, target_branch, false, null, this.props.current_fb_path).then(response=>{
              refresh();
            });
          }
      });
    }
    else{
      git_temp.checkout(true, false, event.target.value, false, null, this.props.current_fb_path).then(respones=>{
        refresh();
      });
    }
  }
  switch_branch_diable_notice(){
      this.setState({show_notice:true});
      setTimeout(function(){
             this.setState({show_notice:false});
        }.bind(this),3000);
  }


  
  render(){
    this.state
    return (
      <div  className='jp-Git-branch'>
        <span className ='jp-Git-branch-label'> <span className='jp-Git-icon-branch'/>
          {this.state.show_notice?'Stage and commit changes before switching branches':this.props.current_branch}
        </span>
        <ToggleDisplay show={!(this.props.disabled)}>
        <select ref="switch_branch_dropdown_button" value = {this.props.current_branch} disabled = {this.props.disabled} 
        title = {this.props.disabled?'Stage and commit changes before switching branches':'select branches'} 
        className='jp-Git-branch-dropdown' onChange={event=>this.switch_branch(event, this.props.refresh)} >
             <option className= 'jp-Git-switch-branch' value=" " disabled>**Switch Branches: </option>
             {this.props.data.map((dj, dj_index)=>
              <option value ={dj.name} key={dj_index}>
                  {dj.name}
              </option>
              )}
              <option className= 'jp-Git-create-branch-line' disabled> </option>
              <option className= 'jp-Git-create-branch' value=''>
                CREATE NEW
              </option>
          </select>
          </ToggleDisplay> 
          <ToggleDisplay show={this.props.disabled&&!(this.state.show_notice)}>
          <select className='jp-Git-branch-dropdown' onClick={()=>this.switch_branch_diable_notice()}/>
          </ToggleDisplay> 
      </div>
    );
  }
}




