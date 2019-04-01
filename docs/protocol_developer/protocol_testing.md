# Nemo Protocol Testing

The Nemo VSCode extension allows protocol developers to connect to an Aquarium
Instance, edit protocols deployed on that instance, and create and run tests of
the protocols.

## A basic test

A protocol test is a class that must have two methods: a `setup` method that
creates the operation(s) that will be tested, and an `analyze` method that
tests the results using Minitest assertions.

We can make basic tests that resemble how the Aquarium developer test tab works.
First adding some operations with random inputs, and, second, ensuring the 
protocol completed normally:

```ruby
class ProtocolTest < ProtocolTestBase
    def setup
        add_random_operations(3)
    end

    def analyze
        assert_equal @backtrace.last[:operation], "complete"
    end
end
```

Where the test assumes that there are input objects for the operations, and, 
so, requires some setup.

Or, we can explicitly define the inputs for the test within the test as in this
example that tests a protocol for ordering primers from the vendor IDT.

```ruby
class ProtocolTest < ProtocolTestBase
  def setup
    Parameter.make('IDT User', 'dummy_user')
    Parameter.make('IDT Password', 'dummy_password')
    sample = primer_sample(name: 'Test Primer')
    add_operation.with_output('Primer', sample)
  end

  def analyze
    assert_equal @backtrace.last[:operation], 'complete'
  end

  def primer_sample(name:, description: 'A primer for testing')
    sample_type(type_name: 'Primer',
                definition: [
                  {
                    name: 'Anneal Sequence',
                    array: false,
                    required: true,
                    ftype: 'string'
                  },
                  {
                    name: 'Overhang Sequence',
                    array: false,
                    required: false,
                    ftype: 'string'
                  },
                  {
                    name: 'T Anneal',
                    array: false,
                    required: true,
                    ftype: 'number'
                  }
                ]).save
    sample(name: name,
           description: description,
           type_name: 'Primer',
           attributes: [
             { name: 'Anneal Sequence', value: 'ATTCTA' },
             { name: 'Overhang Sequence', value: 'ATCTCGAGCT' },
             { name: 'T Anneal', value: 70 }
           ])
  end

  def sample(name:, description:, user: nil, type_name:, attributes:)
    sample_type = sample_type(type_name: type_name)
    return nil if sample_type.nil?

    user = User.all.last if user.nil?
    sample = Sample.creator(
      {
        sample_type_id: sample_type.id,
        description: description,
        name: name,
        project: 'Testing',
        field_values: attributes
      },
      user
    )
    sample
  end

  def sample_type(type_name:, description: 'test type', definition: nil)
    sample_type = SampleType.find_by_name(type_name)
    return sample_type unless sample_type.nil?

    SampleType.create_from_raw(
      name: type_name,
      description: description,
      field_types: definition
    )
  end
end
```

TODO: move this boilerplate factor code out fo the test.

This second approach is self-contained, meaning that it doesn't assume anything
about the instance on which it is being run.