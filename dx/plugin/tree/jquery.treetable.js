/**********************************************************************************
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TreeTable jQuery Plugin Example</title>
    <script src="https://code.jquery.com/jquery-1.12.1.min.js"></script>
    <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <script type="text/javascript" src="src/jquery.treetable.js"></script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" integrity="sha384-y3tfxAZXuh4HwSYylfB+J125MxIs6mR5FOHamPBG064zB+AFeWH94NdvaCBm8qnd" crossorigin="anonymous">
    <style type="text/css">
        .treetable-expanded > td:first-child,
        .treetable-collapsed > td:first-child {
            padding-left: 2em;
        }

        .treetable-expanded > td:first-child > .treetable-expander,
        .treetable-collapsed > td:first-child > .treetable-expander {
            top: 0.05em;
            position: relative;
            margin-left: -1.5em;
            margin-right: 0.25em;
        }

        .treetable-expanded .treetable-expander,
        .treetable-expanded .treetable-expander {
            width: 1em;
            height: 1em;
            cursor: pointer;
            position: relative;
            display: inline-block;
        }

        .treetable-depth-1 > td:first-child {
            padding-left: 3em;
        }

        .treetable-depth-2 > td:first-child {
            padding-left: 4.5em;
        }

        .treetable-depth-3 > td:first-child {
            padding-left: 6em;
        }
    </style>
</head>
<body>
<div class="container" style="margin-top:150px;">
<h1>TreeTable jQuery Plugin Example</h1>
    <table class="table tree table-inverse">
        <thead>
            <tr class="sm-text">
                <th data-type="competency">Competency</th>
                <th class="text-align-center" data-type="percent-above-score">% &gt; Score</th>
                <th data-type="average-score">Average Score</th>
            </tr>
        </thead>
        <tbody>
            <tr data-node="treetable-650__1" data-pnode="">
                <td class="competency sm-text" data-code="A" data-competencyid="650-1">
                    <a href="#1">Application Fluency</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__1_1" data-pnode="treetable-650__1">
                <td class="competency sm-text" data-code="A.1" data-competencyid="650-1.1">
                    <a href="#1.1">Understanding Architecture</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__1_2" data-pnode="treetable-650__1">
                <td class="competency sm-text" data-code="A.2" data-competencyid="650-1.2">
                    <a href="#1.2">Understanding Core Components</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__1_3" data-pnode="treetable-650__1">
                <td class="competency sm-text" data-code="A.3" data-competencyid="650-1.3">
                    <a href="#1.3">PHP Knowledge</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__1_4" data-pnode="treetable-650__1">
                <td class="competency sm-text" data-code="A.4" data-competencyid="650-1.4">
                    <a href="#1.4">JavaScript Knowledge</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__1_5" data-pnode="treetable-650__1">
                <td class="competency sm-text" data-code="A.5" data-competencyid="650-1.5">
                    <a href="#1.5">Bug-Free Code</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__2" data-pnode="">
                <td class="competency sm-text" data-code="B" data-competencyid="650-2">
                    <a href="#2">Be Security Minded</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__2_1" data-pnode="treetable-650__2">
                <td class="competency sm-text" data-code="B.1" data-competencyid="650-2.1">
                    <a href="#2.1">Know Ins and Outs (of Functions)</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__2_2" data-pnode="treetable-650__2">
                <td class="competency sm-text" data-code="B.2" data-competencyid="650-2.2">
                    <a href="#2.2">Know Types</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__2_3" data-pnode="treetable-650__2">
                <td class="competency sm-text" data-code="B.3" data-competencyid="650-2.3">
                    <a href="#2.3">Try to Break Things</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__2_4" data-pnode="treetable-650__2">
                <td class="competency sm-text" data-code="B.4" data-competencyid="650-2.4">
                    <a href="#2.4">Desktop and Server Security</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__3" data-pnode="">
                <td class="competency sm-text" data-code="C" data-competencyid="650-3">
                    <a href="#3">Constantly Learning</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__3_1" data-pnode="treetable-650__3">
                <td class="competency sm-text" data-code="C.1" data-competencyid="650-3.1">
                    <a href="#3.1">Side Projects</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__3_2" data-pnode="treetable-650__3">
                <td class="competency sm-text" data-code="C.2" data-competencyid="650-3.2">
                    <a href="#3.2">Up-to-Date on Tech</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__3_3" data-pnode="treetable-650__3">
                <td class="competency sm-text" data-code="C.3" data-competencyid="650-3.3">
                    <a href="#3.3">New Languages and Paradigms</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__3_4" data-pnode="treetable-650__3">
                <td class="competency sm-text" data-code="C.4" data-competencyid="650-3.4">
                    <a href="#3.4">Doing Existing Things Better</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__4" data-pnode="">
                <td class="competency sm-text" data-code="D" data-competencyid="650-4">
                    <a href="#4">Deliver</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__4_1" data-pnode="treetable-650__4">
                <td class="competency sm-text" data-code="D.1" data-competencyid="650-4.1">
                    <a href="#4.1">Ship Features</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__4_2" data-pnode="treetable-650__4">
                <td class="competency sm-text" data-code="D.2" data-competencyid="650-4.2">
                    <a href="#4.2">Minimal Code Review Needed</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
            <tr data-node="treetable-650__4_3" data-pnode="treetable-650__4">
                <td class="competency sm-text" data-code="D.3" data-competencyid="650-4.3">
                    <a href="#4.3">Developing New Ideas</a>
                </td>
                <td class="percent-above-score sm-text text-align-center">45.5%</td>
                <td class="average-score sm-text color-gray">Effective (3)</td>
            </tr>
        </tbody>
    </table><script>
$(document).ready(function(){

	$('.table').treeTable();

});
</script>
</div>
</body>
</html>
*************************************************************************************/

+function ( $ ) {
    'use strict';

    /**
     * Store reference to plugin with same name.
     */
    var old = $.fn.treeTable;

    /**
     * Public API constructor.
     * Usage: $( selector ).treeTable({ ... })
     */
    function Plugin ( options ) {
        return this.each( function () {
            var $this = $( this );
            var data = $this.data( 'treetable' );

            if ( ! data ) {
                $this.data(
                    'treetable',
                    new TreeTable(
                        this,
                        $.extend(
                            true,
                            $.fn.treeTable.defaults,
                            typeof options == 'object' ? options : {} )
                    ));
            }
        });
    }

    /**
     * API Constructor. Takes in an element selector and an options
     * object and converts the table to be rendered as a tree.
     */
    var TreeTable = function ( element, options ) {
        // Reference to each nodes depth, starts with 0
        this.depths = {};
        // Reference to count of children nodes for each node
        this.children = {};
        // Extended options
        this.options = options;
        this.$table = $( element );
        this.build( this.$table.find( 'tr[data-node^="treetable"]' ) );
    }

    /**
     * Turns the table into a tree, with expand/collapse buttons.
     * This runs in the following steps:
     *   1) Attach event handlers to the toggle buttons
     *   2) Add depth class to each row
     *   3) Insert expand/collapse buttons for rows with children
     *      amd mark initial state (expanded or collapsed)
     */
    TreeTable.prototype.build = function ( nodes ) {
        this.attachEvents();
        this.addDepth( nodes );
        this.addExpanders( nodes );
    };

    /**
     * Iterates over the nodes and adds a CSS class and data attribute
     * for the depth of the node in the tree.
     */
    TreeTable.prototype.addDepth = function ( nodes ) {
        var self = this;

        nodes.each( function ( idx, node ) {
            var $node = $( node );
            var nodeId = $node.data( 'node' );
            var pnodeId = $node.data( 'pnode' );
            var depth = ( pnodeId && pnodeId in self.depths )
                ? self.depths[ pnodeId ] + 1
                : 0;

            // Add a counter to the children if this has a parent
            if ( pnodeId ) {
                self.children[ pnodeId ]++;
            }

            self.children[ nodeId ] = 0;
            $node.data( 'depth', depth );
            self.depths[ nodeId ] = depth;
            $node.addClass( 'treetable-depth-' + depth );
        });
    };

    /**
     * Renders expander buttons to each row with children.
     */
    TreeTable.prototype.addExpanders = function ( nodes ) {
        var self = this;

        nodes.each( function ( idx, node ) {
            var $node = $( node );
            var nodeId = $node.data( 'node' );

            if ( self.children[ nodeId ] > 0 ) {
                $( self.options.expanderTemplate )
                    .prependTo( $node.find( 'td' ).get( 0 ) )
                    .addClass( (self.options.startCollapsed)
                        ? self.options.collapsedClass
                        : self.options.expandedClass );
                $node.addClass( (self.options.startCollapsed)
                    ? 'treetable-collapsed'
                    : 'treetable-expanded' );

                // If the node is to start collapsed, collapse all
                // of this node's children.
                if ( self.options.startCollapsed ) {
                    self.$table.find( 'tr[data-pnode="' + nodeId + '"]' ).hide();
                }
            }
        });
    };

    /**
     * Attaches an event handler to the table for catching all clicks
     * to the expander buttons.
     */
    TreeTable.prototype.attachEvents = function () {
        var self = this;

        this.$table.on( 'click.treetable', '.treetable-expander', function () {
            var $this = $( this );
            self.toggle( $this, $this.closest( 'tr' ) );
        });
    };

    TreeTable.prototype.toggle = function ( $expander, $node ) {
        var nodeId = $node.data( 'node' );

        $expander.toggleClass( this.options.expandedClass );
        $expander.toggleClass( this.options.collapsedClass );
        $node.toggleClass( 'treetable-collapsed treetable-expanded' )
        this.$table.find( 'tr[data-pnode="' + nodeId + '"]' ).toggle();
    };

    $.fn.treeTable = Plugin;
    $.fn.treeTable.defaults = {
        treeColumn: 0,
        startCollapsed: false,
        expandedClass: 'fa fa-angle-down',
        collapsedClass: 'fa fa-angle-right',
        expanderTemplate: '<span class="treetable-expander"></span>'
    };

    $.fn.treeTable.noConflict = function () {
        $.fn.treeTable = old;
        return this;
    }
}( jQuery );
