import FieldIteratorMap from '~/util/field/base/FieldIteratorMap';
import {makeSentenceCase} from '~/util/string/string';
import {Filter, FilterList} from './Filter';

/**
 * @constructor filter-widget.ViewModel ViewModel
 * @parent filter-widget
 * @group filter-widget.ViewModel.props Properties
 *
 * @description A `<filter-widget />` component's ViewModel.
 * extends the [util/field/base/FieldIteratorMap FieldIteratorMap]'s properties
 */
const ViewModel = FieldIteratorMap.extend('FilterWidget', {
    /**
     * @prototype
     */
    /**
     * Disabled the add new form if true
     * @property {Boolean} filter-widget.ViewModel.disableCreate
     * @parent filter-widget.ViewModel.props
     * @inherits {util/field/base/FieldIteratorMap} FieldIteratorMap

     */
    disableCreate: 'htmlbool',
    /**
       * A string referencing a field property that will exclude that field
       * from this classes fields. The default is 'list'.
       * @property {String} list-table.ViewModel.props.excludeFieldKey excludeFieldKey
       * @parent list-table.ViewModel.props
       */
    excludeFieldKey: {
        value: 'filter'
    },
    /**
     * An optional object template to derive field options from. If it is provided,
     * filter-widget will extract the field names and the field types and use that to create
     * filter options.
     * @property {can.Map} filter-widget.ViewModel.ObjectTemplate
     * @parent filter-widget.ViewModel.props
     */
    ObjectTemplate: '*',
    /**
     * A list of filterObjects currently used in this widget
     * @property {Array<filter-widget.Filter>} filter-widget.ViewModel.filters
     * @parent filter-widget.ViewModel.props
     */
    filters: {
        Type: FilterList,
        Value: FilterList
    },
    /**
     * The field properties for the field name dropdown
     * @property {Object} filter-widget.ViewModel.nameField nameField
     * @parent filter-widget.ViewModel
     */
    nameField: {
        get () {
            return this.fieldOptions.length > 1 ? {
                formatter: makeSentenceCase,
                name: 'name',
                alias: 'Field Name',
                fieldType: 'select',
                options: this.fieldOptions,
                inline: true
            } : {
                name: 'name',
                alias: 'Field Name',
                placeholder: 'Enter fieldname'
            };
        }
    },
    /**
     * An array of field options to display for the field selection dropdown. If not provided, the
     * viewModel will look for the ObjectTemplate property and display its keys.
     * <br />TODO: If this property does
     * not exist, the field select will be replaced with a simple text field.
     * @property {Array<form-widget/field-components/select-field.SelectOption>} filter-widget.ViewModel.fieldOptions
     * @parent filter-widget.ViewModel.props
     */
    fieldOptions: {
        get () {
            const fields = [{
                value: '_',
                label: 'Add a filter'
            }];
            if (this.fields.length) {
                var mapped = this.fields.map((f) => {
                    return {
                        value: f.name,
                        label: f.alias
                    };
                });

                return fields.concat(mapped.serialize());
            }
            return this.ObjectTemplate ? fields.concat(Object.keys(new this.ObjectTemplate()).map((key) => {
                return {
                    value: key,
                    label: makeSentenceCase(key)
                };
            })) : [];
        }
    },
    /**
     * The selected field dropdown value
     * @property {String} filter-widget.ViewModel.fieldValue fieldValue
     * @parent filter-widget.ViewModel
     */
    fieldValue: {
        type: 'string',
        value: '_'
    },
    /**
     * Removes a filter from the list of filters
     * @function removeFilter
     * @signature
     * @param  {filter-widget.Filter} obj  The object to remove. This is the only argument used by the function, the rest may be null.
     * @return {undefined}
     */
    removeFilter (obj) {
        const index = this.filters.indexOf(obj);
        this.filters.splice(index, 1);
    },
    /**
     * Replaces the filter array with an empty array, clearing all existing filters
     * @function removeFilters
     * @signature
     * @return {undefined}
     */
    removeFilters () {
        this.filters.replace([]);
    },
    /**
     * Adds a new filter or set of filters to the list of filters in this widget.
     * <br />TODO: A `filterFactory` may be defined on the field which may return one filter or an array of
     * filters.
     * @function addFilter
     * @signature
     * @param  {string} props The properties with a value key of the name of the field filter to add. This is the only argument passed to the function, the rest may be null.
     * @return {Boolean} returns false to prevent event propagation from links
     */
    addFilter () {

        // get the name
        const name = (arguments.length === 4 ? arguments[3] : arguments[0]).value;

        if (!name || name === '_') {
            return false;
        }

        // make a new filter object with the fields used in the form
        let fieldProp;
        if (this.fields.length) {
            fieldProp = this.fields.filter((field) => {
                return field.name === name;
            })[0];
        }

        const filterObj = new Filter({
            field: fieldProp,
            name: name
        });

        this.filters.push(filterObj);


        // reset the dropdown
        this.fieldValue = '_';

        return false;
    },
    noOp (vm, form, event) {
        event.preventDefault();
        return false;
    }
});

export default ViewModel;
