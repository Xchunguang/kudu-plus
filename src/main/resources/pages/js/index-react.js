 /**
 * 将此脚本编译成bundle.js
 */

class ConnectList extends React.Component{
  constructor(props){
    super(props);
    this.state = ({
      selectIndex:0,
      connectList:[],
      connectingList:[]
    })
    //将内部方法绑定到外部用于java调用
    refreshAll = this.getConnectList.bind(this);
    initConnect = this.initConnectList.bind(this); 
    disConnect = this.removeConnectList.bind(this);
    addConnectList = this.addConnectList.bind(this);
  }
  changeSelectIndex=(key)=>{
    this.setState({
      selectIndex:key
    });
  }
  addConnectList=(connectPk)=>{
    let arr = this.state.connectingList;
    arr.push(connectPk);
    this.setState({
      connectingList:arr
    })
  }
  removeConnectList=(connectPk)=>{
    let index = -1;
    for(let i=0;i<this.state.connectingList.length;i++){
      if(this.state.connectingList[i] === connectPk){
        index = i;
        break;
      }
    }

    if(index !== -1){
      let arr = this.state.connectingList;
      arr.splice(index,1);
      this.setState({
        connectingList:arr
      })
    }
  }
  initConnectList=(list)=>{
    let listArr = JSON.parse(list);
    if(listArr.length > 0){
      curConnectPk = listArr[0].connectPk;
    }
    
    this.setState({
      connectList:listArr
    });
  }
  getConnectList=()=>{
    let list = getConnectList();
    this.setState({
      connectList:JSON.parse(list)
    });
  }
  getConnectBlock=()=>{
    let result = [];
    for(let i=0;i<this.state.connectList.length;i++){
      let dom = <ConnectBlock addConnectList={this.addConnectList.bind(this)} connecting={this.state.connectingList.indexOf(this.state.connectList[i].connectPk)>=0} changeSelectIndex={this.changeSelectIndex.bind(this)} selected={this.state.selectIndex === i?true:false} connectPk={this.state.connectList[i].connectPk} curIndex={i} key={i} name={this.state.connectList[i].name}></ConnectBlock>
      result.push(dom);
    }
    return result;
  }
  render(){
    return (
      <div className="connectList">
        {this.getConnectBlock()}
      </div>
    );
  }
};

class ConnectBlock extends React.Component{
  handleSelect=(e)=>{
    curConnectPk = this.props.connectPk;
    this.props.changeSelectIndex(this.props.curIndex);
  }
  connect=()=>{
    let result = connectController.connect(this.props.connectPk);
    if(result === "success"){
      this.props.addConnectList(this.props.connectPk);
    }
  }
  render(){
    return (
      <div id={this.props.connectPk} onContextMenu={this.handleSelect} onDoubleClick={this.connect} onClick={this.handleSelect} className={(this.props.selected?"activeBlock ":"") + "connectBlock"}>
        <span style={{marginRight:5,fontSize:12}} className={(this.props.connecting?"connecting ":"") + "glyphicon glyphicon-link"} aria-hidden="true"></span> {this.props.name}
      </div>
    );
  }
};

class DetailPane extends React.Component{
  constructor(props){
    super(props);
    this.state=({
      openTable:[],
      activeIndex:-1
    })
    openTable = this.openTable.bind(this);
    changeActiveIndex = this.changeActiveIndex.bind(this);
    initOpenTableList = this.initOpenTableList.bind(this);
  }
  initOpenTableList=(list)=>{
    this.setState({
      openTable:JSON.parse(list)
    })
  }
  openTable=(openTableName,openType)=>{
    connectController.openTable(openTableName,openType);
  }
  closeTable=(closeTableName,openType)=>{
    connectController.closeTable(closeTableName,openType);
    this.state.activeIndex = this.state.activeIndex-1;
    if(this.state.activeIndex<-1){
      this.state.activeIndex = -1;
    }
    this.setState({
      activeIndex:this.state.activeIndex
    })
  }
  getPaneHead=()=>{
    let result = [];
    let mainDom = <TableLi key={-1} changeActiveIndex={this.changeActiveIndex.bind(this)} index={-1} active={this.state.activeIndex === -1} closeTable={this.closeTable.bind(this)} name="对象"></TableLi>
    result.push(mainDom);
    for(let i=0;i<this.state.openTable.length;i++){
      let dom = <TableLi changeActiveIndex={this.changeActiveIndex.bind(this)} key={i} index={i} active={this.state.activeIndex === i} closeTable={this.closeTable.bind(this)} name={this.state.openTable[i].tableName} openType={this.state.openTable[i].openType} ></TableLi>
      result.push(dom);
    }
    return result;
  }
  getPaneBody=()=>{
    let result = [];
    let mainDom = <div role="tabpanel" key={-1} className={(this.state.activeIndex === -1)?"tab-pane active":"tab-pane"} id="home"><TablePane openTable={this.openTable.bind(this)}></TablePane></div>
    result.push(mainDom);
    for(let i=0;i<this.state.openTable.length;i++){
      if(this.state.openTable[i].openType === "OPEN_TABLE"){
        let dom = <TableDetail key={i} connectPk={this.state.openTable[i].connectPk} openType={this.state.openTable[i].openType} active={this.state.activeIndex === i} name={this.state.openTable[i].tableName}></TableDetail>
        result.push(dom);
      }else if(this.state.openTable[i].openType === "OPEN_SCHEMA"){
        let dom = <TableStructure openType={this.state.openTable[i].openType} key={i} connectPk={this.state.openTable[i].connectPk} name={this.state.openTable[i].tableName} active={this.state.activeIndex === i}></TableStructure>
        result.push(dom);
      }else if(this.state.openTable[i].openType === "CREATE_TABLE"){
        let dom = <TableStructure openType={this.state.openTable[i].openType} key={i} connectPk={this.state.openTable[i].connectPk} name={this.state.openTable[i].tableName} active={this.state.activeIndex === i}></TableStructure>
        result.push(dom);
      }
      
    }
    return result;
  }
  changeActiveIndex=(index)=>{
    this.setState({
      activeIndex:index
    })
  }
  componentDidUpdate(prevProps,prevState){

  }
  render(){
    return (
      <div className="detailPane">

        <ul id="detailPaneHead" className="nav nav-tabs" role="tablist">

          {this.getPaneHead()}
        </ul>

        <div id="detailPaneBody" className="tab-content">
          
          {this.getPaneBody()}
        </div>

      </div>
    );
  }
};

class TablePane extends React.Component{
  
  constructor(props){
    super(props);
    this.state = ({
      tableList:[],
      searchTitle:'',
      selectedTableIndex:-1
    });
    initTable = this.initTable.bind(this);
  }
  initTable=(listJson)=>{
    this.setState({
      tableList:listJson,
      selectedTableIndex:-1
    })
    curTableName = '';
  }
  changeSelectedIndex=(index)=>{
    this.setState({
      selectedTableIndex:index
    })
  }
  getTableListDOM=()=>{
    let result = [];
    for(let i=0;i<this.state.tableList.length;i++){
      if(this.state.tableList[i].indexOf(this.state.searchTitle) >= 0){
        let dom = <TableBlock openTable={this.props.openTable.bind(this)} changeSelectedIndex={this.changeSelectedIndex.bind(this)} index={i} key={i} name={this.state.tableList[i]} selected={this.state.selectedTableIndex === i}></TableBlock>
        result.push(dom);
      }
    }
    return result;
  }
  changeSearchValue=(e)=>{
    this.state.searchTitle = e.target.value;
  }
  enterProcess=(e)=>{
    if(e.key.toLocaleLowerCase() === 'enter'){
      this.setState({
        searchTitle:this.state.searchTitle
      })
    }
  }
  applySearchBtn=()=>{
    this.setState({
      searchTitle:this.state.searchTitle
    })
  }
  openTable=()=>{
    if(curTableName&&curTableName.length>0){
      this.props.openTable(curTableName,"OPEN_TABLE");
    }
  }
  openSchema=()=>{
    if(curTableName&&curTableName.length>0){
      this.props.openTable(curTableName,"OPEN_SCHEMA");
    }
  }
  createTable=()=>{
    connectController.createTable(false,"");
  }
  renameTable=()=>{
    if(curTableName&&curTableName.length>0){
      connectController.createTable(true,curTableName);
    }
  }
  deleteTable=()=>{
    if(curTableName&&curTableName.length>0){
      let result = connectController.deleteTable(curTableName);
      if(result === 'success'){
        this.setState({
          selectedTableIndex:-1
        })
        curTableName = '';
      }
    }
  }
  render(){
    return (
      <div className="tablePane">
        <div className="tablePaneHead">
            <div className="paneBtn" onClick={this.openTable}>
              <span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span> 打开表  
            </div>

            <div className="paneBtn" onClick={this.openSchema}>
              <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> 表结构  
            </div>

            <div className="paneBtn" onClick={this.createTable}>
              <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> 创建表  
            </div>

            <div className="paneBtn" onClick={this.deleteTable}>
              <span className="glyphicon glyphicon-trash" aria-hidden="true"></span> 删除表  
            </div>

            <div className="paneBtn" onClick={this.renameTable}>
              <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span> 重命名  
            </div>

            <input type="text" onKeyPress={this.enterProcess} onChange={this.changeSearchValue} className="searchTable form-control"/>
            <span onClick={this.applySearchBtn} className="glyphicon glyphicon-search searchTableBtn" aria-hidden="true"></span> 
        </div>
        <div className="tablePaneBody">
          {this.getTableListDOM()}
        </div>
      </div>
    );
  }
}

class TableBlock extends React.Component{
  select=()=>{
    this.props.changeSelectedIndex(this.props.index);
    curTableName = this.props.name;
  }
  openTable=()=>{
    this.props.openTable(this.props.name,"OPEN_TABLE");
  }
  render(){
    return (
      <div onDoubleClick={this.openTable} onClick={this.select} id={this.props.name} className={(this.props.selected?"selectTablePart ":"") + "tablePart"}>
        <span className="glyphicon glyphicon-list-alt" aria-hidden="true"></span> 
        <span className="tableNameSpan" title={this.props.name}>{this.props.name}</span>
      </div>
    );
  }
}

class TableLi extends React.Component{
  closeTable=(e)=>{
    //阻止切换index方法执行
    e.stopPropagation();
    this.props.closeTable(this.props.name,this.props.openType);
  }
  changeActiveIndex=()=>{
    this.props.changeActiveIndex(this.props.index);
  }
  render(){
    let className = this.props.active?"active":"";
    return (
        <li role="presentation" className={className}>
          <a className="paneTitle" onClick={this.changeActiveIndex} aria-controls="profile" role="tab" data-toggle="tab">{this.props.name}  
            {(this.props.index !== -1)&&<span onClick={this.closeTable} className="closeTitleBtn">X</span>}
          </a>  
        </li>
    )
  }
}

class TableDetail extends React.Component{
  constructor(props){
    super(props);
    let searchDto = {
      "connectPk":props.connectPk,
      "filterList":[],
      "rows":[],
      "tableName":props.name,
      "withData":false
    }
    searchDto = JSON.parse(connectController.scanTable(JSON.stringify(searchDto)));
    let titleWidth = [];
    for(let i=0;i<searchDto.schemaList.length;i++){
      titleWidth.push(getLength(searchDto.schemaList[i].name));
    }
    this.state=({
      searchDto:searchDto,
      titleWidth:titleWidth,
      changeRowIndex:[],
      deleteRows:[],
      createRows:[],
      activeRowIndex:[],
      pageIndex:1,
      totalPage:1,
      recordPerPage:50,
      showFilter:false
    })
    doUp = this.doUp.bind(this);
    addManyActiveLine = this.addManyActiveLine.bind(this);
  }

  //组件卸载解除绑定，加载绑定方法
  componentWillReceiveProps(nextProps){
    doUp = this.doUp.bind(this);
    cancelAllActiveLine = this.cancelAllActiveLine.bind(this);
    addManyActiveLine = this.addManyActiveLine.bind(this);
  }

  componentWillUnmount(){
    doUp = function(){};
    cancelAllActiveLine = function(){};
    addManyActiveLine = function(){};
  }

  changeShowFilter=()=>{
    this.setState({
      showFilter:!this.state.showFilter
    })
  }

  loadData=()=>{
    let request = this.state.searchDto;
    request.withData = true;
    delete request.schemaList;
    delete request.rows;
    let response = connectController.scanTable(JSON.stringify(request));
    let searchDto = JSON.parse(response);
    this.setState({
      searchDto:searchDto,
      totalPage:Math.ceil(searchDto.rows.length / this.state.recordPerPage),
      deleteRows:[],
      createRows:[],
      changeRowIndex:[]
    })
  }

  obj = {}

  doDown = (e) => {
    this.obj.drag = true;
    this.obj.oriX = e.clientX;
    this.obj.id = e.target.id;
  };

  doUp = () => {
    if (this.obj.drag) {
      this.obj.drag = false;
    }
  };

  doMove = (e) => {
    if(this.obj.drag === true){
      let widthChange = e.clientX - this.obj.oriX;
      this.obj.oriX = e.clientX;
      let index = parseInt(this.obj.id);
      this.state.titleWidth[index] = this.state.titleWidth[index] + widthChange;
      if(this.state.titleWidth[index] <= getLength(this.state.searchDto.schemaList[index].name)){
        this.state.titleWidth[index] = getLength(this.state.searchDto.schemaList[index].name);
      }
      this.setState({
        titleWidth:this.state.titleWidth
      });
    }
  }

  getHeaderSelect=()=>{
    let result = [];
    let firstDom = <div key={-1} className="headSelect">.</div>
    result.push(firstDom);
    for(let i=0;i<this.state.searchDto.schemaList.length;i++){
      let dom = <div key={i} className="headTitle" style={{width:this.state.titleWidth[i] + 'px'}}><span><strong>{this.state.searchDto.schemaList[i].name}</strong></span> <span id={i} className="dragBtn" onMouseDown={this.doDown}></span></div>
      result.push(dom);
    }
    return result;
  }

  getTableLineDom=()=>{
    let result = [];

    let rows = [];
    rows.push(...this.state.createRows);
    rows.push(...this.state.searchDto.rows);

    let firstIndex = (this.state.pageIndex-1)*this.state.recordPerPage;
    let curPageCount = (this.state.pageIndex*this.state.recordPerPage >= rows.length)?rows.length:this.state.pageIndex*this.state.recordPerPage;
    for(let i=firstIndex;i<curPageCount;i++){
      let dom = <TableLine ifCreate={i<this.state.createRows.length} active={this.state.activeRowIndex.indexOf(i)>=0?true:false} update={this.state.changeRowIndex.indexOf(i)>=0?true:false} addActiveLine={this.addActiveLine.bind(this)} changeData={this.changeData.bind(this)} totalWidth={this.getLineWidth()} key={i} index={i} schema={this.state.searchDto.schemaList} row={rows[i]} width={this.state.titleWidth}></TableLine>
      result.push(dom);
    }
    return result;
  }

  changePageIndex=(e)=>{
    let pageValue = parseInt(e.target.value);
    if(pageValue<=this.state.totalPage&&pageValue>=1){
      this.state.pageIndex = pageValue;
    }
  }

  enterProcess=(e)=>{
    if(e.key.toLocaleLowerCase() === 'enter'){
      this.setState({
        pageIndex:this.state.pageIndex
      })
    }
  }

  nextPage=()=>{
    this.setState({
      pageIndex:(this.state.pageIndex+1)>=this.state.totalPage?this.state.totalPage:this.state.pageIndex+1
    })
  }

  prePage=()=>{
    this.setState({
      pageIndex:(this.state.pageIndex-1)>=1?this.state.pageIndex-1:1
    })
  }

  //计算当前行宽度
  getLineWidth=()=>{
    let totalWidth = 0;
    for(let i=0;i<this.state.titleWidth.length;i++){
      totalWidth += this.state.titleWidth[i];
    }
    return totalWidth+100;//额外加100px
  }

  //修改数据
  changeData=(rowIndex,dataIndex,dataValue)=>{
    if(rowIndex+1 <= this.state.createRows.length){//修改的新增行
      this.state.createRows[rowIndex][dataIndex] = dataValue;
      this.setState({
        createRows:this.state.createRows
      })
    }else{//修改的原始行
      this.state.searchDto.rows[rowIndex-this.state.createRows.length][dataIndex] = dataValue;
      if(this.state.changeRowIndex.indexOf(rowIndex) < 0){
        this.state.changeRowIndex.push(rowIndex);
      }
      this.setState({
        searchDto:this.state.searchDto
      })
    }
    
  }

  //选中所有行
  addManyActiveLine=()=>{
    if(this.state.activeRowIndex.length > 0){
      this.state.activeRowIndex.splice(0,this.state.activeRowIndex.length);
      for(let i=0;i<this.state.searchDto.rows.length+this.state.createRows.length;i++){
        this.state.activeRowIndex.push(i);
      }
      this.setState({
        activeRowIndex:this.state.activeRowIndex
      })
    }
  }

  //选中一行
  addActiveLine=(index)=>{
    this.state.activeRowIndex.splice(0,this.state.activeRowIndex.length);
    this.state.activeRowIndex.push(index);
    this.setState({
      activeRowIndex:this.state.activeRowIndex
    })
  }

  //取消所有行的选择
  cancelAllActiveLine=()=>{
    this.state.activeRowIndex.splice(0,this.state.activeRowIndex.length);
    this.setState({
      activeRowIndex:this.state.activeRowIndex
    })
  }

  getFilterDom=()=>{
    let result = [];
    for(let i=0;i<this.state.searchDto.filterList.length;i++){
      let dom = <TableFilter key={i} filterIndex={i} changeFilter={this.changeFilter.bind(this)} curFilter={this.state.searchDto.filterList[i]} schema={this.state.searchDto.schemaList} ></TableFilter>
      result.push(dom);
    }
    return result;
  }

  addEmptyFilter=()=>{
    let newFilter = {
      columnName:this.state.searchDto.schemaList[0].name,
      type:"EQUAL",
      value:"",
      useful:true
    }
    this.state.searchDto.filterList.push(newFilter);
    this.setState({
      searchDto:this.state.searchDto
    })
  }

  changeFilter=(filterIndex,curFilter)=>{
    //只更新记录不刷新
    this.state.searchDto.filterList[filterIndex] = curFilter;
  }
  addNewLine=()=>{
    let newRow = [];
    for(let i=0;i<this.state.searchDto.schemaList.length;i++){
      newRow.push('');
    }
    this.state.createRows.push(newRow);
    //当新增行时，所有已被修改过的行的index都加1
    for(let m=0;m<this.state.changeRowIndex.length;m++){
      this.state.changeRowIndex[m] += 1;
    }
    this.setState({
      createRows:this.state.createRows,
      changeRowIndex:this.state.changeRowIndex
    })
  }

  deleteLines=(e)=>{
    e.stopPropagation();
    let createRows = this.state.createRows;
    let oldRows = this.state.searchDto.rows;

    let newCreateRows = [];
    let newRows = [];

    let newChangeIndex = this.state.changeRowIndex;
    for(let i=0;i<createRows.length;i++){
      if(this.state.activeRowIndex.indexOf(i)>=0){
        //表示删除了该新增的行，修改记录只记录原有行的，所以删除新增行需要将修改记录里的所有记录减1
        for(let n=0;n<newChangeIndex.length;n++){
          newChangeIndex[n] -= 1;
        }
      }else{
        newCreateRows.push(createRows[i]);
      }
    }

    for(let j=createRows.length;j<createRows.length+oldRows.length;j++){
      if(this.state.activeRowIndex.indexOf(j)>=0){
        this.state.deleteRows.push(oldRows[j-createRows.length]);
        for(let n=0;n<newChangeIndex.length;n++){
          if(newChangeIndex[n] === j){//表示当前修改过的行被删掉了，则删除该index，先置-1,后面统一删除
            newChangeIndex[n] === -1;
          }else if(newChangeIndex[n] > j){//表示当前修改过的行index在被删除的index之后，则被修改的index减1
            newChangeIndex[n] -= 1;
          }
          
        }
      }else{
        newRows.push(oldRows[j-createRows.length]);
      }

    }

    this.state.searchDto.rows = newRows;


    this.setState({
      searchDto:this.state.searchDto,
      createRows:newCreateRows
    })
  }

  saveLineChange=()=>{
    let dto = {
      connectPk:this.state.searchDto.connectPk,
      tableName:this.state.searchDto.tableName,
      schemaList:this.state.searchDto.schemaList
    }
    let result = [];
    if(this.state.createRows.length > 0){
      let createDto = dto;
      createDto.rows = this.state.createRows;
      delete createDto.schemaList;
      createDto.updateType = "insert";
      result.push(createDto);
    }

    if(this.state.deleteRows.length > 0){
      let deleteDto = dto;
      deleteDto.rows = this.state.deleteRows;
      delete deleteDto.schemaList;
      deleteDto.updateType = "delete";
      result.push(deleteDto);
    }

    if(this.state.changeRowIndex.length > 0 ){
      let changeDto = dto;
      changeDto.rows = [];
      for(let i=0;i<this.state.changeRowIndex.length;i++){
        changeDto.rows.push(this.state.searchDto.rows[this.state.changeRowIndex[i]-this.state.createRows.length]);
      }
      delete changeDto.schemaList;
      changeDto.updateType = "update";
      result.push(changeDto);
    }

    let res = connectController.updateRows(JSON.stringify(result));
    if(res === 'success'){
      this.loadData();
    }
  }

  render(){
    return (
      <div role="tabpanel" onMouseMove={this.doMove} onClick={this.cancelAllActiveLine} className={this.props.active?"tab-pane active":"tab-pane"}>
        <div className="tablePane">
          <div className="tablePaneHead">
              <div className={(this.state.changeRowIndex.length>0||this.state.createRows.length>0||this.state.deleteRows.length>0)?"paneBtn":"paneBtn unUseBtn"} onClick={this.saveLineChange}>
                <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> 保存  
              </div>

              <div className="paneBtn" onClick={this.addNewLine}>
                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> 新增行  
              </div>

              <div className={this.state.activeRowIndex.length>0?"paneBtn":"paneBtn unUseBtn"} onClick={this.deleteLines}>
                <span className="glyphicon glyphicon-minus" aria-hidden="true"></span> 删除行  
              </div>

              <div className="paneBtn" onClick={this.changeShowFilter}>
                <span className="glyphicon glyphicon-filter" aria-hidden="true"></span> 筛选  
              </div>

              <div className="paneBtn" onClick={this.loadData}>
                <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> 获取数据  
              </div>
            
          </div>
          <div className="filterArea" style={{display:this.state.showFilter?"block":"none"}}>
            {this.getFilterDom()}  
            <div  style={{display:this.state.showFilter?"block":"none"}}>
              <a onClick={this.addEmptyFilter}>{"<添加>"}</a>&nbsp;&nbsp;<a onClick={this.loadData}>{"<应用>"}</a>
            </div>
          </div>
          <div className="tableDataPaneBody" style={{height:this.state.showFilter?"calc(100% - 149px)":"calc(100% - 49px)"}}>
            <div className="lineHead" style={{width:this.getLineWidth()+'px'}}>
                {this.getHeaderSelect()}
            </div>
            {this.getTableLineDom()}

          </div>
          <div className="tableDataPanefooter">
            <span className="glyphicon glyphicon-triangle-left leftBtn" aria-hidden="true" onClick={this.prePage}></span> 
            <input className="pageInput" onKeyPress={this.enterProcess} value={this.state.pageIndex} onChange={this.changePageIndex}/> <span className="totalPage">/{this.state.totalPage}</span>
            <span className="glyphicon glyphicon-triangle-right rightBtn" aria-hidden="true" onClick={this.nextPage}></span> 
            <span className="footerInfo">共有{this.state.searchDto.rows.length}条记录</span>  
          </div>
        </div>
      </div>
    );
  }
}


class TableLine extends React.Component{
  constructor(props){
    super(props);
    this.state = ({
      row:props.row,
      width:props.width
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      row:nextProps.row,
      width:nextProps.width
    })
  }

  onChange=(e)=>{
    let lineIndex = parseInt(e.target.id);
    if(!this.props.schema[lineIndex].key||this.props.ifCreate){
      this.props.changeData(this.props.index,lineIndex,e.target.value);
    }else{
      connectController.showInfo("主键列不允许更改");
    }
    
  }

  activeCur=(e)=>{
    e.stopPropagation();
    this.props.addActiveLine(this.props.index);
  }

  getTableLineDom=()=>{
    let result = [];
    let headClassName = "lineSelect";
    if(this.props.active){
      headClassName += " activeLine";
    }
    if(this.props.update){
      headClassName += " lineChanged";
    }
    let firstDom = <div onClick={this.activeCur} key={-1} className={headClassName}>></div>
    result.push(firstDom);
    for(let i=0;i<this.state.row.length;i++){
      let dom = <input className={this.props.active?"lineTitle activeLine":"lineTitle"} onChange={this.onChange} style={{width:this.state.width[i] + 'px'}} spellCheck="false" key={i} id={i} value={this.state.row[i]===0||this.state.row[i]?this.state.row[i]:''} />
      result.push(dom);
    }
    return result;
  }
  render(){
    return (
      <div className="line" style={{width:this.props.totalWidth+'px'}}>
          {this.getTableLineDom()}
      </div>
    );
  }
}


class TableStructure extends React.Component{
  constructor(props){
    super(props);
    
    doTableSchemaUp = this.doUp.bind(this);
  }

  componentWillMount(){
    if(this.props.openType === 'OPEN_SCHEMA'){
      this.loadOpenSchema();
    }else if(this.props.openType === 'CREATE_TABLE'){
      this.loadOpenTable();
    }
  }

  loadOpenTable=()=>{
    let searchDto = {
      "connectPk":this.props.connectPk,
      "filterList":[],
      "rows":[],
      "tableName":this.props.name,
      "withData":false,
      "schemaList":[]
    }
    let titleWidth = [];
    let header=["名称","类型","默认值","encoding","允许为空","是否主键"];
    for(let i=0;i<header.length;i++){
      titleWidth.push(getLength(header[i]));
    }
    let rows = [];
    this.setState({
      titleWidth:titleWidth,
      header:header,
      searchDto:searchDto,
      activeRowIndex:[],
      rows:rows,
      deleteRow:[],
      showFilter:false
    })
  }

  loadOpenSchema =()=>{
    let searchDto = {
      "connectPk":this.props.connectPk,
      "filterList":[],
      "rows":[],
      "tableName":this.props.name,
      "withData":false
    }
    searchDto = JSON.parse(connectController.scanTable(JSON.stringify(searchDto)));
    // searchDto = {"connectPk":"d196957c-c57c-4240-9840-25aff08409fc","filterList":[],"rows":[],"schemaList":[{"compressionAlgorithm":"DEFAULT_COMPRESSION","desiredBlockSize":0,"encoding":"AUTO_ENCODING","key":true,"name":"bq_pk","nullable":false,"type":"INT64","typeSize":8},{"compressionAlgorithm":"DEFAULT_COMPRESSION","desiredBlockSize":0,"encoding":"AUTO_ENCODING","key":false,"name":"upload_date","nullable":true,"type":"STRING","typeSize":16},{"compressionAlgorithm":"DEFAULT_COMPRESSION","desiredBlockSize":0,"encoding":"AUTO_ENCODING","key":false,"name":"schema1","nullable":true,"type":"STRING","typeSize":16},{"compressionAlgorithm":"DEFAULT_COMPRESSION","desiredBlockSize":0,"encoding":"AUTO_ENCODING","key":false,"name":"payload","nullable":true,"type":"STRING","typeSize":16}],"tableName":"E000001HFR6YYL2WUB04GVNHW8AU0","withData":false};
    let titleWidth = [];
    let header=["名称","类型","默认值","encoding","允许为空","是否主键"];
    for(let i=0;i<header.length;i++){
      titleWidth.push(getLength(header[i]));
    }
    let rows = [];
    for(let i=0;i<searchDto.schemaList.length;i++){
      let curSchema = searchDto.schemaList[i];
      let row = [];
      row.push(curSchema.name);
      row.push(curSchema.type);
      row.push(curSchema.defaultValue);
      row.push(curSchema.encoding);
      row.push(curSchema.nullable);
      row.push(curSchema.key);
      row.push(curSchema.name);//隐藏属性，原始名称
      rows.push(row);
    }
    this.setState({
      titleWidth:titleWidth,
      header:header,
      searchDto:searchDto,
      activeRowIndex:[],
      rows:rows,
      deleteRow:[],
      showFilter:false
    })
  }

  getHeaderSelect=()=>{
    let result = [];
    
    let firstDom = <div key={-1} className="headSelect">.</div>
    result.push(firstDom);
    for(let i=0;i<this.state.header.length;i++){
      let dom = <div key={i} className="headTitle" style={{width:this.state.titleWidth[i] + 'px'}}><span>{this.state.header[i]}</span> <span id={i} className="dragBtn" onMouseDown={this.doDown}></span></div>
      result.push(dom);
    }
    return result;
  }

  getTableLineDom=()=>{
    let result = [];
    
    for(let i=0;i<this.state.rows.length;i++){
      let dom = <TableSchemaLine schema={this.state.searchDto.schemaList} openType={this.props.openType} active={this.state.activeRowIndex.indexOf(i)>=0?true:false} addActiveLine={this.addActiveLine.bind(this)} changeData={this.changeData.bind(this)} totalWidth={this.getLineWidth()} key={i} index={i} row={this.state.rows[i]} width={this.state.titleWidth}></TableSchemaLine>
      result.push(dom);
    }
    return result;
  }

  obj = {}

  doDown = (e) => {
    this.obj.drag = true;
    this.obj.oriX = e.clientX;
    this.obj.id = e.target.id;
  };

  doUp = () => {
    if (this.obj.drag) {
      this.obj.drag = false;
    }
  };

  doMove = (e) => {
    if(this.obj.drag === true){
      let widthChange = e.clientX - this.obj.oriX;
      this.obj.oriX = e.clientX;
      let index = parseInt(this.obj.id);
      this.state.titleWidth[index] = this.state.titleWidth[index] + widthChange;
      if(this.state.titleWidth[index] <= getLength(this.state.header[index])){
        this.state.titleWidth[index] = getLength(this.state.header[index]);
      }
      this.setState({
        titleWidth:this.state.titleWidth
      });
    }
  }

  addActiveLine=(index)=>{
    this.state.activeRowIndex.splice(0,this.state.activeRowIndex.length);
    this.state.activeRowIndex.push(index);
    this.setState({
      activeRowIndex:this.state.activeRowIndex
    })
  }

  changeData=(rowIndex,dataIndex,dataValue)=>{
    this.state.rows[rowIndex][dataIndex] = dataValue;
    if(dataIndex === 5 && (dataValue === true||dataValue === 'true')){
      this.state.rows[rowIndex][4] = false;
    }
    if(dataIndex === 4 && (dataValue === true||dataValue === 'true') && (this.state.rows[rowIndex][5] === true || this.state.rows[rowIndex][5] === 'true')){
      this.state.rows[rowIndex][4] = false;
    }
    this.setState({
      rows:this.state.rows
    })
  }

  getLineWidth=()=>{
    let totalWidth = 0;
    for(let i=0;i<this.state.header.length;i++){
      totalWidth += this.state.titleWidth[i];
    }
    return totalWidth+100;//额外加100px
  }
  addColumn=()=>{
    let newRow = [];
    newRow.push('');
    newRow.push('INT16');
    newRow.push('');
    newRow.push('AUTO_ENCODING');
    newRow.push(true);
    newRow.push(false);
    newRow.push('new');//隐藏属性，原始名称
    this.state.rows.push(newRow);
    this.setState({
      rows:this.state.rows
    })
  }
  deleteColumn=()=>{
    let newRows = [];
    let deleteRow = [];
    for(let i=0;i<this.state.rows.length;i++){
      if(this.state.activeRowIndex.indexOf(i) >= 0 && (this.state.rows[i][5] !== true && this.state.rows[i][5] !== 'true')){
        deleteRow.push(this.state.rows[i]);
      }else{
        newRows.push(this.state.rows[i]);
      }
    }
    this.setState({
      rows:newRows,
      deleteRow:deleteRow
    })
  }
  saveRows=()=>{
    //使用表明判断是编辑还是新建表
    let insertRows = [];
    insertRows.push(...this.state.rows);

    let insertRowDto = {
      connectPk:this.state.searchDto.connectPk,
      tableName:this.state.searchDto.tableName,
      updateType:'insert',
      rows:insertRows
    }
    let req = [];
    req.push(insertRowDto);
    connectController.updateSchema(JSON.stringify(req));
  }

  showFilterArea=()=>{
    this.setState({
      showFilter:!this.state.showFilter
    })
  }
  getPartitionInfo=()=>{
    let result = [];
    let partArr = connectController.getPartition(this.state.searchDto.tableName);
    partArr = JSON.parse(partArr);
    for(let i=0;i<partArr.length;i++){
      let dom = <p key={i} style={{height:'15px',margin:'3px 5px'}}>{partArr[i]}</p>
      result.push(dom);
    }
    return result;
  }
  render(){
    return (
      <div role="tabpanel" onMouseMove={this.doMove} className={this.props.active?"tab-pane structure active":"tab-pane structure"}>

        <div className="tablePaneHead">
            <div className="paneBtn" onClick={this.saveRows}>
              <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> 保存  
            </div>

            <div className="paneBtn" onClick={this.addColumn}>
              <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> 新增字段  
            </div>

            <div className={this.state.activeRowIndex.length>0?"paneBtn":"paneBtn unUseBtn"} onClick={this.deleteColumn}>
              <span className="glyphicon glyphicon-minus" aria-hidden="true"></span> 删除字段  
            </div>

            <div className="paneBtn" onClick={this.loadOpenSchema}>
              <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> 刷新 
            </div>

            <div className="paneBtn" onClick={this.showFilterArea}>
              <span className="glyphicon glyphicon-minus" aria-hidden="true"></span> 表分区  
            </div>
          
        </div>

        <div className="filterArea" style={{display:this.state.showFilter?"block":"none"}}>
          {this.getPartitionInfo()}
          <div  style={{display:this.state.showFilter?"block":"none"}}>
            <a >{"<添加>"}</a>
          </div>
        </div>
          
        <div className="tableDataPaneBody" style={{overflow:'auto',height:this.state.showFilter?"calc(100% - 149px)":"calc(100% - 49px)"}}>
          <div className="lineHead" style={{width:this.getLineWidth()+'px'}}>
              {this.getHeaderSelect()}
          </div>
          {this.getTableLineDom()}
        </div>

      </div>
    );
  }
}

class TableSchemaLine extends React.Component{

  constructor(props){
    super(props);
    this.state = ({
      row:props.row,
      width:props.width
    })
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      row:nextProps.row,
      width:nextProps.width
    })
  }

  getTableSchemaLine=()=>{
    let result = [];
    let headClassName = "lineSelect";
    if(this.props.active){
      headClassName += " activeLine";
    }
    let firstDom = <div onClick={this.activeCur} key={-1} className={headClassName}>></div>
    result.push(firstDom);
    for(let i=0;i<6;i++){//固定显示，row的第6项用来存储原name
      if(i === 1){//类型
        let dom = <select className={this.props.active?"lineTitle activeLine":"lineTitle"} onChange={this.onChange} style={{width:this.state.width[i] + 'px'}} spellCheck="false" key={i} id={i} value={this.state.row[i]===0||this.state.row[i]?this.state.row[i]:''}><option value="INT8">INT8</option><option value="INT16">INT16</option><option value="INT32">INT32</option><option value="INT64">INT64</option><option value="STRING">STRING</option><option value="BINARY">BINARY</option><option value="BOOL">BOOL</option><option value="FLOAT">FLOAT</option><option value="DOUBLE">DOUBLE</option><option value="UNIXTIME_MICROS">UNIXTIME_MICROS</option></select>
        result.push(dom);
      }else if(i === 5 || i === 4){//5是否主键4允许为空
        let dom = <select className={this.props.active?"lineTitle activeLine":"lineTitle"} onChange={this.onChange} style={{width:this.state.width[i] + 'px'}} spellCheck="false" key={i} id={i} value={this.state.row[i]===0||this.state.row[i]?this.state.row[i]:''}><option value="true">true</option><option value="">false</option></select>
        result.push(dom);
      }else{
        let dom = <input className={this.props.active?"lineTitle activeLine":"lineTitle"} onChange={this.onChange} style={{width:this.state.width[i] + 'px'}} spellCheck="false" key={i} id={i} value={this.state.row[i]===0||this.state.row[i]?this.state.row[i]:''} />
        result.push(dom);
      }
    }
    return result;
  }
  onChange=(e)=>{
    let lineIndex = parseInt(e.target.id);
    if(this.props.openType === "OPEN_SCHEMA"){
      //非主键列部分属性不可以更改
      if(lineIndex === 1 && !this.confirmNewLine()){
        connectController.showInfo("不允许修改列类型");
      }else if(lineIndex === 3){
        connectController.showInfo("暂不支持修改");
      }else if(!this.confirmNewLine() && (lineIndex === 4)){
        connectController.showInfo("不可编辑");
      }else if(lineIndex === 5){//主键列不允许更改
        connectController.showInfo("主键列不允许更改");
      }else{
        this.props.changeData(this.props.index,lineIndex,e.target.value);
      }
    }else if(this.props.openType === "CREATE_TABLE"){
      this.props.changeData(this.props.index,lineIndex,e.target.value);
    }
  }

  //验证当前行是否是新增行
  confirmNewLine=()=>{
    let newLine = true;
    if(!this.props.schema || this.props.schema.length === 0){
      return newLine;
    }
    for(let i=0;i<this.props.schema.length;i++){
      if(this.props.schema[i].name === this.state.row[0]){
        newLine = false;
        break;
      }
    }
    return newLine;
  }

  activeCur=()=>{
    this.props.addActiveLine(this.props.index);
  }
  render(){
    return (
      <div className="line" style={{width:this.props.totalWidth+'px'}}>
          {this.getTableSchemaLine()}
      </div>
    );
  }
}

class TableFilter extends React.Component{
  constructor(props){
    super(props);
    let schema = props.schema;
    let curFilter = props.curFilter;
    
    this.state = ({
      schema:schema,
      curFilter:curFilter,
      nameSelectShow:false,
      relationSelectShow:false,
      valueInputShow:false
    })
    closeSelect = this.closeSelect.bind(this);
  }

  componentWillUnmount(){
    closeSelect = function(){}
  }

  componentWillReceiveProps(nextProps){
    let schema = nextProps.schema;
    let curFilter = nextProps.curFilter;
    
    this.setState({
      schema:schema,
      curFilter:curFilter,
    })
    closeSelect = this.closeSelect.bind(this);
  }

  getRelationName=(code)=>{
    if(code === "GREATER"){
      return "大于";
    }else if(code === "GREATER_EQUAL"){
      return "大于等于";
    }else if(code === "EQUAL"){
      return "等于";
    }else if(code === "LESS"){
      return "小于";
    }else if(code === "LESS_EQUAL"){
      return "小于等于";
    }

  }

  changeFatherFilterInfo=()=>{
    this.props.changeFilter(this.props.filterIndex,this.state.curFilter);
  }

  showNameSelect=(e)=>{
    e.stopPropagation();
    this.setState({
      nameSelectShow:true,
      relationSelectShow:false,
      valueInputShow:false
    })
  }

  showRelationSelect=(e)=>{
    e.stopPropagation();
    this.setState({
      relationSelectShow:true,
      nameSelectShow:false,
      valueInputShow:false
    })
  }

  showInputSelect=(e)=>{
    e.stopPropagation();
    this.setState({
      valueInputShow:true,
      nameSelectShow:false,
      relationSelectShow:false
    })
  }

  closeSelect=()=>{
    this.setState({
      nameSelectShow:false,
      relationSelectShow:false,
      valueInputShow:false
    })
  }
  
  clickInput=(e)=>{
    e.stopPropagation();
  }

  changeUseful=(e)=>{
    this.state.curFilter.useful = e.target.checked;
    this.setState({
      curFilter:this.state.curFilter
    })
    this.changeFatherFilterInfo();
  }

  changeColumnName=(e)=>{
    this.state.curFilter.columnName = e.target.id;
    this.setState({
      curFilter:this.state.curFilter
    })
    this.changeFatherFilterInfo();
  }

  getFileDom=()=>{
    let result = [];
    for(let i=0;i<this.state.schema.length;i++){
      let dom = <div key={i} className="curName" id={this.state.schema[i].name} onClick={this.changeColumnName}>{this.state.schema[i].name}</div>
      result.push(dom);
    }
    return result;
  }
  changeRelation=(e)=>{
    this.state.curFilter.type = e.target.id;
    this.setState({
      curFilter:this.state.curFilter
    })
    this.changeFatherFilterInfo();
  }
  changeFilterValue=(e)=>{
    this.state.curFilter.value = e.target.value;
    this.setState({
      curFilter:this.state.curFilter
    })
    this.changeFatherFilterInfo();
  }
  pressEnter=(e)=>{
    if(e.key.toLocaleLowerCase() === 'enter'){
      this.setState({
        valueInputShow:false
      })
    }
  }
  render(){
    return (
      <div className="filterBlock">
        <input type="checkbox" onChange={this.changeUseful} checked={this.state.curFilter.useful}/>&nbsp;&nbsp;
        <a className="filterName" onClick={this.showNameSelect}>{this.state.curFilter.columnName}</a>&nbsp;&nbsp;
        <span className="filterName" onClick={this.showRelationSelect}>{this.getRelationName(this.state.curFilter.type)}</span>&nbsp;&nbsp;
        <a className="filterName valueInputBtn" onClick={this.showInputSelect}>{this.state.curFilter.value}</a>&nbsp;&nbsp;

        <div className="nameSelect" style={{display:this.state.nameSelectShow?"block":"none"}}>
            {this.getFileDom()}
        </div>
        <div className="nameSelect relationSelect" style={{display:this.state.relationSelectShow?"block":"none"}}>
          <div className="curName" id="GREATER" onClick={this.changeRelation}>大于</div>
          <div className="curName" id="GREATER_EQUAL"  onClick={this.changeRelation}>大于等于</div>
          <div className="curName" id="EQUAL"  onClick={this.changeRelation}>等于</div>
          <div className="curName" id="LESS"  onClick={this.changeRelation}>小于</div>
          <div className="curName" id="LESS_EQUAL"  onClick={this.changeRelation}>小于等于</div>
        </div>
        <input onClick={this.clickInput} onKeyPress={this.pressEnter} value={this.state.curFilter.value} onChange={this.changeFilterValue} className="nameSelect valueInput " style={{display:this.state.valueInputShow?"block":"none"}}/>
      </div>
    );
  }
}


ReactDOM.render(
    <div className="listPartDom">
      <ConnectList></ConnectList>
      <DetailPane></DetailPane>
    </div>,
    document.getElementById('listPart')
);