"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
* 将此脚本编译成bundle.js
*/

var ConnectList = function (_React$Component) {
  _inherits(ConnectList, _React$Component);

  function ConnectList(props) {
    _classCallCheck(this, ConnectList);

    var _this = _possibleConstructorReturn(this, (ConnectList.__proto__ || Object.getPrototypeOf(ConnectList)).call(this, props));

    _this.changeSelectIndex = function (key) {
      _this.setState({
        selectIndex: key
      });
    };

    _this.addConnectList = function (connectPk) {
      var arr = _this.state.connectingList;
      arr.push(connectPk);
      _this.setState({
        connectingList: arr
      });
    };

    _this.removeConnectList = function (connectPk) {
      var index = -1;
      for (var i = 0; i < _this.state.connectingList.length; i++) {
        if (_this.state.connectingList[i] === connectPk) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        var arr = _this.state.connectingList;
        arr.splice(index, 1);
        _this.setState({
          connectingList: arr
        });
      }
    };

    _this.initConnectList = function (list) {
      var listArr = JSON.parse(list);
      if (listArr.length > 0) {
        curConnectPk = listArr[0].connectPk;
      }

      _this.setState({
        connectList: listArr
      });
    };

    _this.getConnectList = function () {
      var list = getConnectList();
      _this.setState({
        connectList: JSON.parse(list)
      });
    };

    _this.getConnectBlock = function () {
      var result = [];
      for (var i = 0; i < _this.state.connectList.length; i++) {
        var dom = React.createElement(ConnectBlock, { addConnectList: _this.addConnectList.bind(_this), connecting: _this.state.connectingList.indexOf(_this.state.connectList[i].connectPk) >= 0, changeSelectIndex: _this.changeSelectIndex.bind(_this), selected: _this.state.selectIndex === i ? true : false, connectPk: _this.state.connectList[i].connectPk, curIndex: i, key: i, name: _this.state.connectList[i].name });
        result.push(dom);
      }
      return result;
    };

    _this.state = {
      selectIndex: 0,
      connectList: [],
      connectingList: []
    };
    //将内部方法绑定到外部用于java调用
    refreshAll = _this.getConnectList.bind(_this);
    initConnect = _this.initConnectList.bind(_this);
    disConnect = _this.removeConnectList.bind(_this);
    addConnectList = _this.addConnectList.bind(_this);
    return _this;
  }

  _createClass(ConnectList, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "connectList" },
        this.getConnectBlock()
      );
    }
  }]);

  return ConnectList;
}(React.Component);

;

var ConnectBlock = function (_React$Component2) {
  _inherits(ConnectBlock, _React$Component2);

  function ConnectBlock() {
    var _ref;

    var _temp, _this2, _ret;

    _classCallCheck(this, ConnectBlock);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = ConnectBlock.__proto__ || Object.getPrototypeOf(ConnectBlock)).call.apply(_ref, [this].concat(args))), _this2), _this2.handleSelect = function (e) {
      curConnectPk = _this2.props.connectPk;
      _this2.props.changeSelectIndex(_this2.props.curIndex);
    }, _this2.connect = function () {
      var result = connectController.connect(_this2.props.connectPk);
      if (result === "success") {
        _this2.props.addConnectList(_this2.props.connectPk);
      }
    }, _temp), _possibleConstructorReturn(_this2, _ret);
  }

  _createClass(ConnectBlock, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: this.props.connectPk, onContextMenu: this.handleSelect, onDoubleClick: this.connect, onClick: this.handleSelect, className: (this.props.selected ? "activeBlock " : "") + "connectBlock" },
        React.createElement("span", { style: { marginRight: 5, fontSize: 12 }, className: (this.props.connecting ? "connecting " : "") + "glyphicon glyphicon-link", "aria-hidden": "true" }),
        " ",
        this.props.name
      );
    }
  }]);

  return ConnectBlock;
}(React.Component);

;

var DetailPane = function (_React$Component3) {
  _inherits(DetailPane, _React$Component3);

  function DetailPane(props) {
    _classCallCheck(this, DetailPane);

    var _this3 = _possibleConstructorReturn(this, (DetailPane.__proto__ || Object.getPrototypeOf(DetailPane)).call(this, props));

    _this3.initOpenTableList = function (list) {
      _this3.setState({
        openTable: JSON.parse(list)
      });
    };

    _this3.openTable = function (openTableName, openType) {
      connectController.openTable(openTableName, openType);
    };

    _this3.closeTable = function (closeTableName, openType) {
      connectController.closeTable(closeTableName, openType);
      _this3.state.activeIndex = _this3.state.activeIndex - 1;
      if (_this3.state.activeIndex < -1) {
        _this3.state.activeIndex = -1;
      }
      _this3.setState({
        activeIndex: _this3.state.activeIndex
      });
    };

    _this3.getPaneHead = function () {
      var result = [];
      var mainDom = React.createElement(TableLi, { key: -1, changeActiveIndex: _this3.changeActiveIndex.bind(_this3), index: -1, active: _this3.state.activeIndex === -1, closeTable: _this3.closeTable.bind(_this3), name: "\u5BF9\u8C61" });
      result.push(mainDom);
      for (var i = 0; i < _this3.state.openTable.length; i++) {
        var dom = React.createElement(TableLi, { changeActiveIndex: _this3.changeActiveIndex.bind(_this3), key: i, index: i, active: _this3.state.activeIndex === i, closeTable: _this3.closeTable.bind(_this3), name: _this3.state.openTable[i].tableName, openType: _this3.state.openTable[i].openType });
        result.push(dom);
      }
      return result;
    };

    _this3.getPaneBody = function () {
      var result = [];
      var mainDom = React.createElement(
        "div",
        { role: "tabpanel", key: -1, className: _this3.state.activeIndex === -1 ? "tab-pane active" : "tab-pane", id: "home" },
        React.createElement(TablePane, { openTable: _this3.openTable.bind(_this3) })
      );
      result.push(mainDom);
      for (var i = 0; i < _this3.state.openTable.length; i++) {
        if (_this3.state.openTable[i].openType === "OPEN_TABLE") {
          var dom = React.createElement(TableDetail, { key: i, connectPk: _this3.state.openTable[i].connectPk, openType: _this3.state.openTable[i].openType, active: _this3.state.activeIndex === i, name: _this3.state.openTable[i].tableName });
          result.push(dom);
        } else if (_this3.state.openTable[i].openType === "OPEN_SCHEMA") {
          var _dom = React.createElement(TableStructure, { openType: _this3.state.openTable[i].openType, key: i, connectPk: _this3.state.openTable[i].connectPk, name: _this3.state.openTable[i].tableName, active: _this3.state.activeIndex === i });
          result.push(_dom);
        } else if (_this3.state.openTable[i].openType === "CREATE_TABLE") {
          var _dom2 = React.createElement(TableStructure, { openType: _this3.state.openTable[i].openType, key: i, connectPk: _this3.state.openTable[i].connectPk, name: _this3.state.openTable[i].tableName, active: _this3.state.activeIndex === i });
          result.push(_dom2);
        }
      }
      return result;
    };

    _this3.changeActiveIndex = function (index) {
      _this3.setState({
        activeIndex: index
      });
    };

    _this3.state = {
      openTable: [],
      activeIndex: -1
    };
    openTable = _this3.openTable.bind(_this3);
    changeActiveIndex = _this3.changeActiveIndex.bind(_this3);
    initOpenTableList = _this3.initOpenTableList.bind(_this3);
    return _this3;
  }

  _createClass(DetailPane, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {}
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "detailPane" },
        React.createElement(
          "ul",
          { id: "detailPaneHead", className: "nav nav-tabs", role: "tablist" },
          this.getPaneHead()
        ),
        React.createElement(
          "div",
          { id: "detailPaneBody", className: "tab-content" },
          this.getPaneBody()
        )
      );
    }
  }]);

  return DetailPane;
}(React.Component);

;

var TablePane = function (_React$Component4) {
  _inherits(TablePane, _React$Component4);

  function TablePane(props) {
    _classCallCheck(this, TablePane);

    var _this4 = _possibleConstructorReturn(this, (TablePane.__proto__ || Object.getPrototypeOf(TablePane)).call(this, props));

    _this4.initTable = function (listJson) {
      _this4.setState({
        tableList: listJson,
        selectedTableIndex: -1
      });
      curTableName = '';
    };

    _this4.changeSelectedIndex = function (index) {
      _this4.setState({
        selectedTableIndex: index
      });
    };

    _this4.getTableListDOM = function () {
      var result = [];
      for (var i = 0; i < _this4.state.tableList.length; i++) {
        if (_this4.state.tableList[i].indexOf(_this4.state.searchTitle) >= 0) {
          var dom = React.createElement(TableBlock, { openTable: _this4.props.openTable.bind(_this4), changeSelectedIndex: _this4.changeSelectedIndex.bind(_this4), index: i, key: i, name: _this4.state.tableList[i], selected: _this4.state.selectedTableIndex === i });
          result.push(dom);
        }
      }
      return result;
    };

    _this4.changeSearchValue = function (e) {
      _this4.state.searchTitle = e.target.value;
    };

    _this4.enterProcess = function (e) {
      if (e.key.toLocaleLowerCase() === 'enter') {
        _this4.setState({
          searchTitle: _this4.state.searchTitle
        });
      }
    };

    _this4.applySearchBtn = function () {
      _this4.setState({
        searchTitle: _this4.state.searchTitle
      });
    };

    _this4.openTable = function () {
      if (curTableName && curTableName.length > 0) {
        _this4.props.openTable(curTableName, "OPEN_TABLE");
      }
    };

    _this4.openSchema = function () {
      if (curTableName && curTableName.length > 0) {
        _this4.props.openTable(curTableName, "OPEN_SCHEMA");
      }
    };

    _this4.createTable = function () {
      connectController.createTable(false, "");
    };

    _this4.renameTable = function () {
      if (curTableName && curTableName.length > 0) {
        connectController.createTable(true, curTableName);
      }
    };

    _this4.deleteTable = function () {
      if (curTableName && curTableName.length > 0) {
        var result = connectController.deleteTable(curTableName);
        if (result === 'success') {
          _this4.setState({
            selectedTableIndex: -1
          });
          curTableName = '';
        }
      }
    };

    _this4.state = {
      tableList: [],
      searchTitle: '',
      selectedTableIndex: -1
    };
    initTable = _this4.initTable.bind(_this4);
    return _this4;
  }

  _createClass(TablePane, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "tablePane" },
        React.createElement(
          "div",
          { className: "tablePaneHead" },
          React.createElement(
            "div",
            { className: "paneBtn", onClick: this.openTable },
            React.createElement("span", { className: "glyphicon glyphicon-folder-open", "aria-hidden": "true" }),
            " \u6253\u5F00\u8868"
          ),
          React.createElement(
            "div",
            { className: "paneBtn", onClick: this.openSchema },
            React.createElement("span", { className: "glyphicon glyphicon-edit", "aria-hidden": "true" }),
            " \u8868\u7ED3\u6784"
          ),
          React.createElement(
            "div",
            { className: "paneBtn", onClick: this.createTable },
            React.createElement("span", { className: "glyphicon glyphicon-plus", "aria-hidden": "true" }),
            " \u521B\u5EFA\u8868"
          ),
          React.createElement(
            "div",
            { className: "paneBtn", onClick: this.deleteTable },
            React.createElement("span", { className: "glyphicon glyphicon-trash", "aria-hidden": "true" }),
            " \u5220\u9664\u8868"
          ),
          React.createElement(
            "div",
            { className: "paneBtn", onClick: this.renameTable },
            React.createElement("span", { className: "glyphicon glyphicon-pencil", "aria-hidden": "true" }),
            " \u91CD\u547D\u540D"
          ),
          React.createElement("input", { type: "text", onKeyPress: this.enterProcess, onChange: this.changeSearchValue, className: "searchTable form-control" }),
          React.createElement("span", { onClick: this.applySearchBtn, className: "glyphicon glyphicon-search searchTableBtn", "aria-hidden": "true" })
        ),
        React.createElement(
          "div",
          { className: "tablePaneBody" },
          this.getTableListDOM()
        )
      );
    }
  }]);

  return TablePane;
}(React.Component);

var TableBlock = function (_React$Component5) {
  _inherits(TableBlock, _React$Component5);

  function TableBlock() {
    var _ref2;

    var _temp2, _this5, _ret2;

    _classCallCheck(this, TableBlock);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this5 = _possibleConstructorReturn(this, (_ref2 = TableBlock.__proto__ || Object.getPrototypeOf(TableBlock)).call.apply(_ref2, [this].concat(args))), _this5), _this5.select = function () {
      _this5.props.changeSelectedIndex(_this5.props.index);
      curTableName = _this5.props.name;
    }, _this5.openTable = function () {
      _this5.props.openTable(_this5.props.name, "OPEN_TABLE");
    }, _temp2), _possibleConstructorReturn(_this5, _ret2);
  }

  _createClass(TableBlock, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { onDoubleClick: this.openTable, onClick: this.select, id: this.props.name, className: (this.props.selected ? "selectTablePart " : "") + "tablePart" },
        React.createElement("span", { className: "glyphicon glyphicon-list-alt", "aria-hidden": "true" }),
        React.createElement(
          "span",
          { className: "tableNameSpan", title: this.props.name },
          this.props.name
        )
      );
    }
  }]);

  return TableBlock;
}(React.Component);

var TableLi = function (_React$Component6) {
  _inherits(TableLi, _React$Component6);

  function TableLi() {
    var _ref3;

    var _temp3, _this6, _ret3;

    _classCallCheck(this, TableLi);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp3 = (_this6 = _possibleConstructorReturn(this, (_ref3 = TableLi.__proto__ || Object.getPrototypeOf(TableLi)).call.apply(_ref3, [this].concat(args))), _this6), _this6.closeTable = function (e) {
      //阻止切换index方法执行
      e.stopPropagation();
      _this6.props.closeTable(_this6.props.name, _this6.props.openType);
    }, _this6.changeActiveIndex = function () {
      _this6.props.changeActiveIndex(_this6.props.index);
    }, _temp3), _possibleConstructorReturn(_this6, _ret3);
  }

  _createClass(TableLi, [{
    key: "render",
    value: function render() {
      var className = this.props.active ? "active" : "";
      return React.createElement(
        "li",
        { role: "presentation", className: className },
        React.createElement(
          "a",
          { className: "paneTitle", onClick: this.changeActiveIndex, "aria-controls": "profile", role: "tab", "data-toggle": "tab" },
          this.props.name,
          this.props.index !== -1 && React.createElement(
            "span",
            { onClick: this.closeTable, className: "closeTitleBtn" },
            "X"
          )
        )
      );
    }
  }]);

  return TableLi;
}(React.Component);

var TableDetail = function (_React$Component7) {
  _inherits(TableDetail, _React$Component7);

  function TableDetail(props) {
    _classCallCheck(this, TableDetail);

    var _this7 = _possibleConstructorReturn(this, (TableDetail.__proto__ || Object.getPrototypeOf(TableDetail)).call(this, props));

    _initialiseProps.call(_this7);

    var searchDto = {
      "connectPk": props.connectPk,
      "filterList": [],
      "rows": [],
      "tableName": props.name,
      "withData": false
    };
    searchDto = JSON.parse(connectController.scanTable(JSON.stringify(searchDto)));
    var titleWidth = [];
    for (var i = 0; i < searchDto.schemaList.length; i++) {
      titleWidth.push(getLength(searchDto.schemaList[i].name));
    }
    _this7.state = {
      searchDto: searchDto,
      titleWidth: titleWidth,
      changeRowIndex: [],
      deleteRows: [],
      createRows: [],
      activeRowIndex: [],
      pageIndex: 1,
      totalPage: 1,
      recordPerPage: 50,
      showFilter: false
    };
    doUp = _this7.doUp.bind(_this7);
    addManyActiveLine = _this7.addManyActiveLine.bind(_this7);
    return _this7;
  }

  //组件卸载解除绑定，加载绑定方法


  _createClass(TableDetail, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      doUp = this.doUp.bind(this);
      cancelAllActiveLine = this.cancelAllActiveLine.bind(this);
      addManyActiveLine = this.addManyActiveLine.bind(this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      doUp = function doUp() {};
      cancelAllActiveLine = function cancelAllActiveLine() {};
      addManyActiveLine = function addManyActiveLine() {};
    }

    //计算当前行宽度


    //修改数据


    //选中所有行


    //选中一行


    //取消所有行的选择

  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { role: "tabpanel", onMouseMove: this.doMove, onClick: this.cancelAllActiveLine, className: this.props.active ? "tab-pane active" : "tab-pane" },
        React.createElement(
          "div",
          { className: "tablePane" },
          React.createElement(
            "div",
            { className: "tablePaneHead" },
            React.createElement(
              "div",
              { className: this.state.changeRowIndex.length > 0 || this.state.createRows.length > 0 || this.state.deleteRows.length > 0 ? "paneBtn" : "paneBtn unUseBtn", onClick: this.saveLineChange },
              React.createElement("span", { className: "glyphicon glyphicon-floppy-disk", "aria-hidden": "true" }),
              " \u4FDD\u5B58"
            ),
            React.createElement(
              "div",
              { className: "paneBtn", onClick: this.addNewLine },
              React.createElement("span", { className: "glyphicon glyphicon-plus", "aria-hidden": "true" }),
              " \u65B0\u589E\u884C"
            ),
            React.createElement(
              "div",
              { className: this.state.activeRowIndex.length > 0 ? "paneBtn" : "paneBtn unUseBtn", onClick: this.deleteLines },
              React.createElement("span", { className: "glyphicon glyphicon-minus", "aria-hidden": "true" }),
              " \u5220\u9664\u884C"
            ),
            React.createElement(
              "div",
              { className: "paneBtn", onClick: this.changeShowFilter },
              React.createElement("span", { className: "glyphicon glyphicon-filter", "aria-hidden": "true" }),
              " \u7B5B\u9009"
            ),
            React.createElement(
              "div",
              { className: "paneBtn", onClick: this.loadData },
              React.createElement("span", { className: "glyphicon glyphicon-refresh", "aria-hidden": "true" }),
              " \u83B7\u53D6\u6570\u636E"
            )
          ),
          React.createElement(
            "div",
            { className: "filterArea", style: { display: this.state.showFilter ? "block" : "none" } },
            this.getFilterDom(),
            React.createElement(
              "div",
              { style: { display: this.state.showFilter ? "block" : "none" } },
              React.createElement(
                "a",
                { onClick: this.addEmptyFilter },
                "<添加>"
              ),
              "\xA0\xA0",
              React.createElement(
                "a",
                { onClick: this.loadData },
                "<应用>"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "tableDataPaneBody", style: { height: this.state.showFilter ? "calc(100% - 149px)" : "calc(100% - 49px)" } },
            React.createElement(
              "div",
              { className: "lineHead", style: { width: this.getLineWidth() + 'px' } },
              this.getHeaderSelect()
            ),
            this.getTableLineDom()
          ),
          React.createElement(
            "div",
            { className: "tableDataPanefooter" },
            React.createElement("span", { className: "glyphicon glyphicon-triangle-left leftBtn", "aria-hidden": "true", onClick: this.prePage }),
            React.createElement("input", { className: "pageInput", onKeyPress: this.enterProcess, value: this.state.pageIndex, onChange: this.changePageIndex }),
            " ",
            React.createElement(
              "span",
              { className: "totalPage" },
              "/",
              this.state.totalPage
            ),
            React.createElement("span", { className: "glyphicon glyphicon-triangle-right rightBtn", "aria-hidden": "true", onClick: this.nextPage }),
            React.createElement(
              "span",
              { className: "footerInfo" },
              "\u5171\u6709",
              this.state.searchDto.rows.length,
              "\u6761\u8BB0\u5F55"
            )
          )
        )
      );
    }
  }]);

  return TableDetail;
}(React.Component);

var _initialiseProps = function _initialiseProps() {
  var _this12 = this;

  this.changeShowFilter = function () {
    _this12.setState({
      showFilter: !_this12.state.showFilter
    });
  };

  this.loadData = function () {
    var request = _this12.state.searchDto;
    request.withData = true;
    delete request.schemaList;
    delete request.rows;
    var response = connectController.scanTable(JSON.stringify(request));
    var searchDto = JSON.parse(response);
    _this12.setState({
      searchDto: searchDto,
      totalPage: Math.ceil(searchDto.rows.length / _this12.state.recordPerPage),
      deleteRows: [],
      createRows: [],
      changeRowIndex: []
    });
  };

  this.obj = {};

  this.doDown = function (e) {
    _this12.obj.drag = true;
    _this12.obj.oriX = e.clientX;
    _this12.obj.id = e.target.id;
  };

  this.doUp = function () {
    if (_this12.obj.drag) {
      _this12.obj.drag = false;
    }
  };

  this.doMove = function (e) {
    if (_this12.obj.drag === true) {
      var widthChange = e.clientX - _this12.obj.oriX;
      _this12.obj.oriX = e.clientX;
      var index = parseInt(_this12.obj.id);
      _this12.state.titleWidth[index] = _this12.state.titleWidth[index] + widthChange;
      if (_this12.state.titleWidth[index] <= getLength(_this12.state.searchDto.schemaList[index].name)) {
        _this12.state.titleWidth[index] = getLength(_this12.state.searchDto.schemaList[index].name);
      }
      _this12.setState({
        titleWidth: _this12.state.titleWidth
      });
    }
  };

  this.getHeaderSelect = function () {
    var result = [];
    var firstDom = React.createElement(
      "div",
      { key: -1, className: "headSelect" },
      "."
    );
    result.push(firstDom);
    for (var i = 0; i < _this12.state.searchDto.schemaList.length; i++) {
      var dom = React.createElement(
        "div",
        { key: i, className: "headTitle", style: { width: _this12.state.titleWidth[i] + 'px' } },
        React.createElement(
          "span",
          null,
          React.createElement(
            "strong",
            null,
            _this12.state.searchDto.schemaList[i].name
          )
        ),
        " ",
        React.createElement("span", { id: i, className: "dragBtn", onMouseDown: _this12.doDown })
      );
      result.push(dom);
    }
    return result;
  };

  this.getTableLineDom = function () {
    var result = [];

    var rows = [];
    rows.push.apply(rows, _toConsumableArray(_this12.state.createRows));
    rows.push.apply(rows, _toConsumableArray(_this12.state.searchDto.rows));

    var firstIndex = (_this12.state.pageIndex - 1) * _this12.state.recordPerPage;
    var curPageCount = _this12.state.pageIndex * _this12.state.recordPerPage >= rows.length ? rows.length : _this12.state.pageIndex * _this12.state.recordPerPage;
    for (var i = firstIndex; i < curPageCount; i++) {
      var dom = React.createElement(TableLine, { ifCreate: i < _this12.state.createRows.length, active: _this12.state.activeRowIndex.indexOf(i) >= 0 ? true : false, update: _this12.state.changeRowIndex.indexOf(i) >= 0 ? true : false, addActiveLine: _this12.addActiveLine.bind(_this12), changeData: _this12.changeData.bind(_this12), totalWidth: _this12.getLineWidth(), key: i, index: i, schema: _this12.state.searchDto.schemaList, row: rows[i], width: _this12.state.titleWidth });
      result.push(dom);
    }
    return result;
  };

  this.changePageIndex = function (e) {
    var pageValue = parseInt(e.target.value);
    if (pageValue <= _this12.state.totalPage && pageValue >= 1) {
      _this12.state.pageIndex = pageValue;
    }
  };

  this.enterProcess = function (e) {
    if (e.key.toLocaleLowerCase() === 'enter') {
      _this12.setState({
        pageIndex: _this12.state.pageIndex
      });
    }
  };

  this.nextPage = function () {
    _this12.setState({
      pageIndex: _this12.state.pageIndex + 1 >= _this12.state.totalPage ? _this12.state.totalPage : _this12.state.pageIndex + 1
    });
  };

  this.prePage = function () {
    _this12.setState({
      pageIndex: _this12.state.pageIndex - 1 >= 1 ? _this12.state.pageIndex - 1 : 1
    });
  };

  this.getLineWidth = function () {
    var totalWidth = 0;
    for (var i = 0; i < _this12.state.titleWidth.length; i++) {
      totalWidth += _this12.state.titleWidth[i];
    }
    return totalWidth + 100; //额外加100px
  };

  this.changeData = function (rowIndex, dataIndex, dataValue) {
    if (rowIndex + 1 <= _this12.state.createRows.length) {
      //修改的新增行
      _this12.state.createRows[rowIndex][dataIndex] = dataValue;
      _this12.setState({
        createRows: _this12.state.createRows
      });
    } else {
      //修改的原始行
      _this12.state.searchDto.rows[rowIndex - _this12.state.createRows.length][dataIndex] = dataValue;
      if (_this12.state.changeRowIndex.indexOf(rowIndex) < 0) {
        _this12.state.changeRowIndex.push(rowIndex);
      }
      _this12.setState({
        searchDto: _this12.state.searchDto
      });
    }
  };

  this.addManyActiveLine = function () {
    if (_this12.state.activeRowIndex.length > 0) {
      _this12.state.activeRowIndex.splice(0, _this12.state.activeRowIndex.length);
      for (var i = 0; i < _this12.state.searchDto.rows.length + _this12.state.createRows.length; i++) {
        _this12.state.activeRowIndex.push(i);
      }
      _this12.setState({
        activeRowIndex: _this12.state.activeRowIndex
      });
    }
  };

  this.addActiveLine = function (index) {
    _this12.state.activeRowIndex.splice(0, _this12.state.activeRowIndex.length);
    _this12.state.activeRowIndex.push(index);
    _this12.setState({
      activeRowIndex: _this12.state.activeRowIndex
    });
  };

  this.cancelAllActiveLine = function () {
    _this12.state.activeRowIndex.splice(0, _this12.state.activeRowIndex.length);
    _this12.setState({
      activeRowIndex: _this12.state.activeRowIndex
    });
  };

  this.getFilterDom = function () {
    var result = [];
    for (var i = 0; i < _this12.state.searchDto.filterList.length; i++) {
      var dom = React.createElement(TableFilter, { key: i, filterIndex: i, changeFilter: _this12.changeFilter.bind(_this12), curFilter: _this12.state.searchDto.filterList[i], schema: _this12.state.searchDto.schemaList });
      result.push(dom);
    }
    return result;
  };

  this.addEmptyFilter = function () {
    var newFilter = {
      columnName: _this12.state.searchDto.schemaList[0].name,
      type: "EQUAL",
      value: "",
      useful: true
    };
    _this12.state.searchDto.filterList.push(newFilter);
    _this12.setState({
      searchDto: _this12.state.searchDto
    });
  };

  this.changeFilter = function (filterIndex, curFilter) {
    //只更新记录不刷新
    _this12.state.searchDto.filterList[filterIndex] = curFilter;
  };

  this.addNewLine = function () {
    var newRow = [];
    for (var i = 0; i < _this12.state.searchDto.schemaList.length; i++) {
      newRow.push('');
    }
    _this12.state.createRows.push(newRow);
    //当新增行时，所有已被修改过的行的index都加1
    for (var m = 0; m < _this12.state.changeRowIndex.length; m++) {
      _this12.state.changeRowIndex[m] += 1;
    }
    _this12.setState({
      createRows: _this12.state.createRows,
      changeRowIndex: _this12.state.changeRowIndex
    });
  };

  this.deleteLines = function (e) {
    e.stopPropagation();
    var createRows = _this12.state.createRows;
    var oldRows = _this12.state.searchDto.rows;

    var newCreateRows = [];
    var newRows = [];

    var newChangeIndex = _this12.state.changeRowIndex;
    for (var i = 0; i < createRows.length; i++) {
      if (_this12.state.activeRowIndex.indexOf(i) >= 0) {
        //表示删除了该新增的行，修改记录只记录原有行的，所以删除新增行需要将修改记录里的所有记录减1
        for (var n = 0; n < newChangeIndex.length; n++) {
          newChangeIndex[n] -= 1;
        }
      } else {
        newCreateRows.push(createRows[i]);
      }
    }

    for (var j = createRows.length; j < createRows.length + oldRows.length; j++) {
      if (_this12.state.activeRowIndex.indexOf(j) >= 0) {
        _this12.state.deleteRows.push(oldRows[j - createRows.length]);
        for (var _n = 0; _n < newChangeIndex.length; _n++) {
          if (newChangeIndex[_n] === j) {
            //表示当前修改过的行被删掉了，则删除该index，先置-1,后面统一删除
            newChangeIndex[_n] === -1;
          } else if (newChangeIndex[_n] > j) {
            //表示当前修改过的行index在被删除的index之后，则被修改的index减1
            newChangeIndex[_n] -= 1;
          }
        }
      } else {
        newRows.push(oldRows[j - createRows.length]);
      }
    }

    _this12.state.searchDto.rows = newRows;

    _this12.setState({
      searchDto: _this12.state.searchDto,
      createRows: newCreateRows
    });
  };

  this.saveLineChange = function () {
    var dto = {
      connectPk: _this12.state.searchDto.connectPk,
      tableName: _this12.state.searchDto.tableName,
      schemaList: _this12.state.searchDto.schemaList
    };
    var result = [];
    if (_this12.state.createRows.length > 0) {
      var createDto = dto;
      createDto.rows = _this12.state.createRows;
      delete createDto.schemaList;
      createDto.updateType = "insert";
      result.push(createDto);
    }

    if (_this12.state.deleteRows.length > 0) {
      var deleteDto = dto;
      deleteDto.rows = _this12.state.deleteRows;
      delete deleteDto.schemaList;
      deleteDto.updateType = "delete";
      result.push(deleteDto);
    }

    if (_this12.state.changeRowIndex.length > 0) {
      var changeDto = dto;
      changeDto.rows = [];
      for (var i = 0; i < _this12.state.changeRowIndex.length; i++) {
        changeDto.rows.push(_this12.state.searchDto.rows[_this12.state.changeRowIndex[i] - _this12.state.createRows.length]);
      }
      delete changeDto.schemaList;
      changeDto.updateType = "update";
      result.push(changeDto);
    }

    var res = connectController.updateRows(JSON.stringify(result));
    if (res === 'success') {
      _this12.loadData();
    }
  };
};

var TableLine = function (_React$Component8) {
  _inherits(TableLine, _React$Component8);

  function TableLine(props) {
    _classCallCheck(this, TableLine);

    var _this8 = _possibleConstructorReturn(this, (TableLine.__proto__ || Object.getPrototypeOf(TableLine)).call(this, props));

    _this8.onChange = function (e) {
      var lineIndex = parseInt(e.target.id);
      if (!_this8.props.schema[lineIndex].key || _this8.props.ifCreate) {
        _this8.props.changeData(_this8.props.index, lineIndex, e.target.value);
      } else {
        connectController.showInfo("主键列不允许更改");
      }
    };

    _this8.activeCur = function (e) {
      e.stopPropagation();
      _this8.props.addActiveLine(_this8.props.index);
    };

    _this8.getTableLineDom = function () {
      var result = [];
      var headClassName = "lineSelect";
      if (_this8.props.active) {
        headClassName += " activeLine";
      }
      if (_this8.props.update) {
        headClassName += " lineChanged";
      }
      var firstDom = React.createElement(
        "div",
        { onClick: _this8.activeCur, key: -1, className: headClassName },
        ">"
      );
      result.push(firstDom);
      for (var i = 0; i < _this8.state.row.length; i++) {
        var dom = React.createElement("input", { className: _this8.props.active ? "lineTitle activeLine" : "lineTitle", onChange: _this8.onChange, style: { width: _this8.state.width[i] + 'px' }, spellCheck: "false", key: i, id: i, value: _this8.state.row[i] === 0 || _this8.state.row[i] ? _this8.state.row[i] : '' });
        result.push(dom);
      }
      return result;
    };

    _this8.state = {
      row: props.row,
      width: props.width
    };
    return _this8;
  }

  _createClass(TableLine, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        row: nextProps.row,
        width: nextProps.width
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "line", style: { width: this.props.totalWidth + 'px' } },
        this.getTableLineDom()
      );
    }
  }]);

  return TableLine;
}(React.Component);

var TableStructure = function (_React$Component9) {
  _inherits(TableStructure, _React$Component9);

  function TableStructure(props) {
    _classCallCheck(this, TableStructure);

    var _this9 = _possibleConstructorReturn(this, (TableStructure.__proto__ || Object.getPrototypeOf(TableStructure)).call(this, props));

    _this9.loadOpenTable = function () {
      var searchDto = {
        "connectPk": _this9.props.connectPk,
        "filterList": [],
        "rows": [],
        "tableName": _this9.props.name,
        "withData": false,
        "schemaList": []
      };
      var titleWidth = [];
      var header = ["名称", "类型", "默认值", "encoding", "允许为空", "是否主键"];
      for (var i = 0; i < header.length; i++) {
        titleWidth.push(getLength(header[i]));
      }
      var rows = [];
      _this9.setState({
        titleWidth: titleWidth,
        header: header,
        searchDto: searchDto,
        activeRowIndex: [],
        rows: rows,
        deleteRow: [],
        showFilter: false
      });
    };

    _this9.loadOpenSchema = function () {
      var searchDto = {
        "connectPk": _this9.props.connectPk,
        "filterList": [],
        "rows": [],
        "tableName": _this9.props.name,
        "withData": false
      };
      searchDto = JSON.parse(connectController.scanTable(JSON.stringify(searchDto)));
      // searchDto = {"connectPk":"d196957c-c57c-4240-9840-25aff08409fc","filterList":[],"rows":[],"schemaList":[{"compressionAlgorithm":"DEFAULT_COMPRESSION","desiredBlockSize":0,"encoding":"AUTO_ENCODING","key":true,"name":"bq_pk","nullable":false,"type":"INT64","typeSize":8},{"compressionAlgorithm":"DEFAULT_COMPRESSION","desiredBlockSize":0,"encoding":"AUTO_ENCODING","key":false,"name":"upload_date","nullable":true,"type":"STRING","typeSize":16},{"compressionAlgorithm":"DEFAULT_COMPRESSION","desiredBlockSize":0,"encoding":"AUTO_ENCODING","key":false,"name":"schema1","nullable":true,"type":"STRING","typeSize":16},{"compressionAlgorithm":"DEFAULT_COMPRESSION","desiredBlockSize":0,"encoding":"AUTO_ENCODING","key":false,"name":"payload","nullable":true,"type":"STRING","typeSize":16}],"tableName":"E000001HFR6YYL2WUB04GVNHW8AU0","withData":false};
      var titleWidth = [];
      var header = ["名称", "类型", "默认值", "encoding", "允许为空", "是否主键"];
      for (var i = 0; i < header.length; i++) {
        titleWidth.push(getLength(header[i]));
      }
      var rows = [];
      for (var _i = 0; _i < searchDto.schemaList.length; _i++) {
        var curSchema = searchDto.schemaList[_i];
        var row = [];
        row.push(curSchema.name);
        row.push(curSchema.type);
        row.push(curSchema.defaultValue);
        row.push(curSchema.encoding);
        row.push(curSchema.nullable);
        row.push(curSchema.key);
        row.push(curSchema.name); //隐藏属性，原始名称
        rows.push(row);
      }
      _this9.setState({
        titleWidth: titleWidth,
        header: header,
        searchDto: searchDto,
        activeRowIndex: [],
        rows: rows,
        deleteRow: [],
        showFilter: false
      });
    };

    _this9.getHeaderSelect = function () {
      var result = [];

      var firstDom = React.createElement(
        "div",
        { key: -1, className: "headSelect" },
        "."
      );
      result.push(firstDom);
      for (var i = 0; i < _this9.state.header.length; i++) {
        var dom = React.createElement(
          "div",
          { key: i, className: "headTitle", style: { width: _this9.state.titleWidth[i] + 'px' } },
          React.createElement(
            "span",
            null,
            _this9.state.header[i]
          ),
          " ",
          React.createElement("span", { id: i, className: "dragBtn", onMouseDown: _this9.doDown })
        );
        result.push(dom);
      }
      return result;
    };

    _this9.getTableLineDom = function () {
      var result = [];

      for (var i = 0; i < _this9.state.rows.length; i++) {
        var dom = React.createElement(TableSchemaLine, { schema: _this9.state.searchDto.schemaList, openType: _this9.props.openType, active: _this9.state.activeRowIndex.indexOf(i) >= 0 ? true : false, addActiveLine: _this9.addActiveLine.bind(_this9), changeData: _this9.changeData.bind(_this9), totalWidth: _this9.getLineWidth(), key: i, index: i, row: _this9.state.rows[i], width: _this9.state.titleWidth });
        result.push(dom);
      }
      return result;
    };

    _this9.obj = {};

    _this9.doDown = function (e) {
      _this9.obj.drag = true;
      _this9.obj.oriX = e.clientX;
      _this9.obj.id = e.target.id;
    };

    _this9.doUp = function () {
      if (_this9.obj.drag) {
        _this9.obj.drag = false;
      }
    };

    _this9.doMove = function (e) {
      if (_this9.obj.drag === true) {
        var widthChange = e.clientX - _this9.obj.oriX;
        _this9.obj.oriX = e.clientX;
        var index = parseInt(_this9.obj.id);
        _this9.state.titleWidth[index] = _this9.state.titleWidth[index] + widthChange;
        if (_this9.state.titleWidth[index] <= getLength(_this9.state.header[index])) {
          _this9.state.titleWidth[index] = getLength(_this9.state.header[index]);
        }
        _this9.setState({
          titleWidth: _this9.state.titleWidth
        });
      }
    };

    _this9.addActiveLine = function (index) {
      _this9.state.activeRowIndex.splice(0, _this9.state.activeRowIndex.length);
      _this9.state.activeRowIndex.push(index);
      _this9.setState({
        activeRowIndex: _this9.state.activeRowIndex
      });
    };

    _this9.changeData = function (rowIndex, dataIndex, dataValue) {
      _this9.state.rows[rowIndex][dataIndex] = dataValue;
      if (dataIndex === 5 && (dataValue === true || dataValue === 'true')) {
        _this9.state.rows[rowIndex][4] = false;
      }
      if (dataIndex === 4 && (dataValue === true || dataValue === 'true') && (_this9.state.rows[rowIndex][5] === true || _this9.state.rows[rowIndex][5] === 'true')) {
        _this9.state.rows[rowIndex][4] = false;
      }
      _this9.setState({
        rows: _this9.state.rows
      });
    };

    _this9.getLineWidth = function () {
      var totalWidth = 0;
      for (var i = 0; i < _this9.state.header.length; i++) {
        totalWidth += _this9.state.titleWidth[i];
      }
      return totalWidth + 100; //额外加100px
    };

    _this9.addColumn = function () {
      var newRow = [];
      newRow.push('');
      newRow.push('INT16');
      newRow.push('');
      newRow.push('AUTO_ENCODING');
      newRow.push(true);
      newRow.push(false);
      newRow.push('new'); //隐藏属性，原始名称
      _this9.state.rows.push(newRow);
      _this9.setState({
        rows: _this9.state.rows
      });
    };

    _this9.deleteColumn = function () {
      var newRows = [];
      var deleteRow = [];
      for (var i = 0; i < _this9.state.rows.length; i++) {
        if (_this9.state.activeRowIndex.indexOf(i) >= 0 && _this9.state.rows[i][5] !== true && _this9.state.rows[i][5] !== 'true') {
          deleteRow.push(_this9.state.rows[i]);
        } else {
          newRows.push(_this9.state.rows[i]);
        }
      }
      _this9.setState({
        rows: newRows,
        deleteRow: deleteRow
      });
    };

    _this9.saveRows = function () {
      //使用表明判断是编辑还是新建表
      var insertRows = [];
      insertRows.push.apply(insertRows, _toConsumableArray(_this9.state.rows));

      var insertRowDto = {
        connectPk: _this9.state.searchDto.connectPk,
        tableName: _this9.state.searchDto.tableName,
        updateType: 'insert',
        rows: insertRows
      };
      var req = [];
      req.push(insertRowDto);
      connectController.updateSchema(JSON.stringify(req));
    };

    _this9.showFilterArea = function () {
      _this9.setState({
        showFilter: !_this9.state.showFilter
      });
    };

    _this9.getPartitionInfo = function () {
      var result = [];
      var partArr = connectController.getPartition(_this9.state.searchDto.tableName);
      partArr = JSON.parse(partArr);
      for (var i = 0; i < partArr.length; i++) {
        var dom = React.createElement(
          "p",
          { key: i, style: { height: '15px', margin: '3px 5px' } },
          partArr[i]
        );
        result.push(dom);
      }
      return result;
    };

    doTableSchemaUp = _this9.doUp.bind(_this9);
    return _this9;
  }

  _createClass(TableStructure, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      if (this.props.openType === 'OPEN_SCHEMA') {
        this.loadOpenSchema();
      } else if (this.props.openType === 'CREATE_TABLE') {
        this.loadOpenTable();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { role: "tabpanel", onMouseMove: this.doMove, className: this.props.active ? "tab-pane structure active" : "tab-pane structure" },
        React.createElement(
          "div",
          { className: "tablePaneHead" },
          React.createElement(
            "div",
            { className: "paneBtn", onClick: this.saveRows },
            React.createElement("span", { className: "glyphicon glyphicon-floppy-disk", "aria-hidden": "true" }),
            " \u4FDD\u5B58"
          ),
          React.createElement(
            "div",
            { className: "paneBtn", onClick: this.addColumn },
            React.createElement("span", { className: "glyphicon glyphicon-plus", "aria-hidden": "true" }),
            " \u65B0\u589E\u5B57\u6BB5"
          ),
          React.createElement(
            "div",
            { className: this.state.activeRowIndex.length > 0 ? "paneBtn" : "paneBtn unUseBtn", onClick: this.deleteColumn },
            React.createElement("span", { className: "glyphicon glyphicon-minus", "aria-hidden": "true" }),
            " \u5220\u9664\u5B57\u6BB5"
          ),
          React.createElement(
            "div",
            { className: "paneBtn", onClick: this.loadOpenSchema },
            React.createElement("span", { className: "glyphicon glyphicon-refresh", "aria-hidden": "true" }),
            " \u5237\u65B0"
          ),
          React.createElement(
            "div",
            { className: "paneBtn", onClick: this.showFilterArea },
            React.createElement("span", { className: "glyphicon glyphicon-minus", "aria-hidden": "true" }),
            " \u8868\u5206\u533A"
          )
        ),
        React.createElement(
          "div",
          { className: "filterArea", style: { display: this.state.showFilter ? "block" : "none" } },
          this.getPartitionInfo(),
          React.createElement(
            "div",
            { style: { display: this.state.showFilter ? "block" : "none" } },
            React.createElement(
              "a",
              null,
              "<添加>"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "tableDataPaneBody", style: { overflow: 'auto', height: this.state.showFilter ? "calc(100% - 149px)" : "calc(100% - 49px)" } },
          React.createElement(
            "div",
            { className: "lineHead", style: { width: this.getLineWidth() + 'px' } },
            this.getHeaderSelect()
          ),
          this.getTableLineDom()
        )
      );
    }
  }]);

  return TableStructure;
}(React.Component);

var TableSchemaLine = function (_React$Component10) {
  _inherits(TableSchemaLine, _React$Component10);

  function TableSchemaLine(props) {
    _classCallCheck(this, TableSchemaLine);

    var _this10 = _possibleConstructorReturn(this, (TableSchemaLine.__proto__ || Object.getPrototypeOf(TableSchemaLine)).call(this, props));

    _this10.getTableSchemaLine = function () {
      var result = [];
      var headClassName = "lineSelect";
      if (_this10.props.active) {
        headClassName += " activeLine";
      }
      var firstDom = React.createElement(
        "div",
        { onClick: _this10.activeCur, key: -1, className: headClassName },
        ">"
      );
      result.push(firstDom);
      for (var i = 0; i < 6; i++) {
        //固定显示，row的第6项用来存储原name
        if (i === 1) {
          //类型
          var dom = React.createElement(
            "select",
            { className: _this10.props.active ? "lineTitle activeLine" : "lineTitle", onChange: _this10.onChange, style: { width: _this10.state.width[i] + 'px' }, spellCheck: "false", key: i, id: i, value: _this10.state.row[i] === 0 || _this10.state.row[i] ? _this10.state.row[i] : '' },
            React.createElement(
              "option",
              { value: "INT8" },
              "INT8"
            ),
            React.createElement(
              "option",
              { value: "INT16" },
              "INT16"
            ),
            React.createElement(
              "option",
              { value: "INT32" },
              "INT32"
            ),
            React.createElement(
              "option",
              { value: "INT64" },
              "INT64"
            ),
            React.createElement(
              "option",
              { value: "STRING" },
              "STRING"
            ),
            React.createElement(
              "option",
              { value: "BINARY" },
              "BINARY"
            ),
            React.createElement(
              "option",
              { value: "BOOL" },
              "BOOL"
            ),
            React.createElement(
              "option",
              { value: "FLOAT" },
              "FLOAT"
            ),
            React.createElement(
              "option",
              { value: "DOUBLE" },
              "DOUBLE"
            ),
            React.createElement(
              "option",
              { value: "UNIXTIME_MICROS" },
              "UNIXTIME_MICROS"
            )
          );
          result.push(dom);
        } else if (i === 5 || i === 4) {
          //5是否主键4允许为空
          var _dom3 = React.createElement(
            "select",
            { className: _this10.props.active ? "lineTitle activeLine" : "lineTitle", onChange: _this10.onChange, style: { width: _this10.state.width[i] + 'px' }, spellCheck: "false", key: i, id: i, value: _this10.state.row[i] === 0 || _this10.state.row[i] ? _this10.state.row[i] : '' },
            React.createElement(
              "option",
              { value: "true" },
              "true"
            ),
            React.createElement(
              "option",
              { value: "" },
              "false"
            )
          );
          result.push(_dom3);
        } else {
          var _dom4 = React.createElement("input", { className: _this10.props.active ? "lineTitle activeLine" : "lineTitle", onChange: _this10.onChange, style: { width: _this10.state.width[i] + 'px' }, spellCheck: "false", key: i, id: i, value: _this10.state.row[i] === 0 || _this10.state.row[i] ? _this10.state.row[i] : '' });
          result.push(_dom4);
        }
      }
      return result;
    };

    _this10.onChange = function (e) {
      var lineIndex = parseInt(e.target.id);
      if (_this10.props.openType === "OPEN_SCHEMA") {
        //非主键列部分属性不可以更改
        if (lineIndex === 1 && !_this10.confirmNewLine()) {
          connectController.showInfo("不允许修改列类型");
        } else if (lineIndex === 3) {
          connectController.showInfo("暂不支持修改");
        } else if (!_this10.confirmNewLine() && lineIndex === 4) {
          connectController.showInfo("不可编辑");
        } else if (lineIndex === 5) {
          //主键列不允许更改
          connectController.showInfo("主键列不允许更改");
        } else {
          _this10.props.changeData(_this10.props.index, lineIndex, e.target.value);
        }
      } else if (_this10.props.openType === "CREATE_TABLE") {
        _this10.props.changeData(_this10.props.index, lineIndex, e.target.value);
      }
    };

    _this10.confirmNewLine = function () {
      var newLine = true;
      if (!_this10.props.schema || _this10.props.schema.length === 0) {
        return newLine;
      }
      for (var i = 0; i < _this10.props.schema.length; i++) {
        if (_this10.props.schema[i].name === _this10.state.row[0]) {
          newLine = false;
          break;
        }
      }
      return newLine;
    };

    _this10.activeCur = function () {
      _this10.props.addActiveLine(_this10.props.index);
    };

    _this10.state = {
      row: props.row,
      width: props.width
    };
    return _this10;
  }

  _createClass(TableSchemaLine, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        row: nextProps.row,
        width: nextProps.width
      });
    }

    //验证当前行是否是新增行

  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "line", style: { width: this.props.totalWidth + 'px' } },
        this.getTableSchemaLine()
      );
    }
  }]);

  return TableSchemaLine;
}(React.Component);

var TableFilter = function (_React$Component11) {
  _inherits(TableFilter, _React$Component11);

  function TableFilter(props) {
    _classCallCheck(this, TableFilter);

    var _this11 = _possibleConstructorReturn(this, (TableFilter.__proto__ || Object.getPrototypeOf(TableFilter)).call(this, props));

    _this11.getRelationName = function (code) {
      if (code === "GREATER") {
        return "大于";
      } else if (code === "GREATER_EQUAL") {
        return "大于等于";
      } else if (code === "EQUAL") {
        return "等于";
      } else if (code === "LESS") {
        return "小于";
      } else if (code === "LESS_EQUAL") {
        return "小于等于";
      }
    };

    _this11.changeFatherFilterInfo = function () {
      _this11.props.changeFilter(_this11.props.filterIndex, _this11.state.curFilter);
    };

    _this11.showNameSelect = function (e) {
      e.stopPropagation();
      _this11.setState({
        nameSelectShow: true,
        relationSelectShow: false,
        valueInputShow: false
      });
    };

    _this11.showRelationSelect = function (e) {
      e.stopPropagation();
      _this11.setState({
        relationSelectShow: true,
        nameSelectShow: false,
        valueInputShow: false
      });
    };

    _this11.showInputSelect = function (e) {
      e.stopPropagation();
      _this11.setState({
        valueInputShow: true,
        nameSelectShow: false,
        relationSelectShow: false
      });
    };

    _this11.closeSelect = function () {
      _this11.setState({
        nameSelectShow: false,
        relationSelectShow: false,
        valueInputShow: false
      });
    };

    _this11.clickInput = function (e) {
      e.stopPropagation();
    };

    _this11.changeUseful = function (e) {
      _this11.state.curFilter.useful = e.target.checked;
      _this11.setState({
        curFilter: _this11.state.curFilter
      });
      _this11.changeFatherFilterInfo();
    };

    _this11.changeColumnName = function (e) {
      _this11.state.curFilter.columnName = e.target.id;
      _this11.setState({
        curFilter: _this11.state.curFilter
      });
      _this11.changeFatherFilterInfo();
    };

    _this11.getFileDom = function () {
      var result = [];
      for (var i = 0; i < _this11.state.schema.length; i++) {
        var dom = React.createElement(
          "div",
          { key: i, className: "curName", id: _this11.state.schema[i].name, onClick: _this11.changeColumnName },
          _this11.state.schema[i].name
        );
        result.push(dom);
      }
      return result;
    };

    _this11.changeRelation = function (e) {
      _this11.state.curFilter.type = e.target.id;
      _this11.setState({
        curFilter: _this11.state.curFilter
      });
      _this11.changeFatherFilterInfo();
    };

    _this11.changeFilterValue = function (e) {
      _this11.state.curFilter.value = e.target.value;
      _this11.setState({
        curFilter: _this11.state.curFilter
      });
      _this11.changeFatherFilterInfo();
    };

    _this11.pressEnter = function (e) {
      if (e.key.toLocaleLowerCase() === 'enter') {
        _this11.setState({
          valueInputShow: false
        });
      }
    };

    var schema = props.schema;
    var curFilter = props.curFilter;

    _this11.state = {
      schema: schema,
      curFilter: curFilter,
      nameSelectShow: false,
      relationSelectShow: false,
      valueInputShow: false
    };
    closeSelect = _this11.closeSelect.bind(_this11);
    return _this11;
  }

  _createClass(TableFilter, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      closeSelect = function closeSelect() {};
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var schema = nextProps.schema;
      var curFilter = nextProps.curFilter;

      this.setState({
        schema: schema,
        curFilter: curFilter
      });
      closeSelect = this.closeSelect.bind(this);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "filterBlock" },
        React.createElement("input", { type: "checkbox", onChange: this.changeUseful, checked: this.state.curFilter.useful }),
        "\xA0\xA0",
        React.createElement(
          "a",
          { className: "filterName", onClick: this.showNameSelect },
          this.state.curFilter.columnName
        ),
        "\xA0\xA0",
        React.createElement(
          "span",
          { className: "filterName", onClick: this.showRelationSelect },
          this.getRelationName(this.state.curFilter.type)
        ),
        "\xA0\xA0",
        React.createElement(
          "a",
          { className: "filterName valueInputBtn", onClick: this.showInputSelect },
          this.state.curFilter.value
        ),
        "\xA0\xA0",
        React.createElement(
          "div",
          { className: "nameSelect", style: { display: this.state.nameSelectShow ? "block" : "none" } },
          this.getFileDom()
        ),
        React.createElement(
          "div",
          { className: "nameSelect relationSelect", style: { display: this.state.relationSelectShow ? "block" : "none" } },
          React.createElement(
            "div",
            { className: "curName", id: "GREATER", onClick: this.changeRelation },
            "\u5927\u4E8E"
          ),
          React.createElement(
            "div",
            { className: "curName", id: "GREATER_EQUAL", onClick: this.changeRelation },
            "\u5927\u4E8E\u7B49\u4E8E"
          ),
          React.createElement(
            "div",
            { className: "curName", id: "EQUAL", onClick: this.changeRelation },
            "\u7B49\u4E8E"
          ),
          React.createElement(
            "div",
            { className: "curName", id: "LESS", onClick: this.changeRelation },
            "\u5C0F\u4E8E"
          ),
          React.createElement(
            "div",
            { className: "curName", id: "LESS_EQUAL", onClick: this.changeRelation },
            "\u5C0F\u4E8E\u7B49\u4E8E"
          )
        ),
        React.createElement("input", { onClick: this.clickInput, onKeyPress: this.pressEnter, value: this.state.curFilter.value, onChange: this.changeFilterValue, className: "nameSelect valueInput ", style: { display: this.state.valueInputShow ? "block" : "none" } })
      );
    }
  }]);

  return TableFilter;
}(React.Component);

ReactDOM.render(React.createElement(
  "div",
  { className: "listPartDom" },
  React.createElement(ConnectList, null),
  React.createElement(DetailPane, null)
), document.getElementById('listPart'));