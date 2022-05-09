import {
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {Icon} from "@rneui/base";
import tw from "tailwind-react-native-classnames";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import {useContext, useEffect, useState} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import {TaskContext} from "../utils/TodoContext";


function NewTask() {
    const navigation = useNavigation()
    const route = useRoute()
    const [input, setInput] = useState()
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [displayDate, setDisplayDate] = useState(null)
    const [displayTime, setDisplayTime] = useState(null)
    const {task, setTask} = useContext(TaskContext)

    useEffect(() => {
        let id = route.params.id
        setInput(filterData(id, 'title'))
        setDisplayDate(filterData(id, 'date'))
        setDisplayTime(filterData(id, 'time'))
    }, [])

    function filterData(key, param) {
        let value = null
        task.find(task => {
            if (task.key === key) {
                param ? value = task[param] : value = task
            }
        })
        return value
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        let tempDate = new Date(currentDate)
        let formatDate = `${tempDate.getDate()}/${tempDate.getMonth() + 1}/${tempDate.getFullYear()}`
        let formatTime = `${tempDate.getHours()}:${tempDate.getMinutes()} ${tempDate.getHours() >= 12 ? 'PM' : 'AM'}`
        setDisplayDate(formatDate)
        setDisplayTime(formatTime)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };
    const editStore = async () => {
        try {
            if (input !== '') {
                const mock = [...task]
                mock.find(item => {
                    if (item.key === route.params.id) {
                        item.title = input
                        item.date = displayDate
                        item.time = displayTime
                    }
                })
                setTask(mock)
                console.log(task)
                navigation.navigate('ListTask')
            }
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <View>
            <View style={tw`bg-blue-400 pt-12 flex-row px-3 pb-8 items-center`}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ListTask')}>
                    <Icon name='close' style={tw`w-6 h-6 mr-8`} color='white'
                          type='antdesign'/>
                </TouchableOpacity>
                <Text
                    style={tw`text-2xl text-white font-semibold tracking-wide`}>Edit
                    task</Text>

            </View>
            <KeyboardAvoidingView behavior='height'
                                  style={tw`justify-between -mt-4 rounded-3xl py-6 px-3  `}>

                <View style={tw`h-5/6`}>
                    <TextInput
                        style={[tw`text-2xl text-gray-600 w-full`, {paddingVertical: 30}]}
                        value={input}
                        placeholder='What would you like to add here?'
                        onChangeText={(text) => setInput(text)}
                    />
                    <View>
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                display='clock'
                                onChange={onChange}
                            />
                        )}
                    </View>
                </View>

                <View
                    style={tw`flex-row  justify-between inset-x-0  absolute bottom-0 px-4`}>
                    <View style={tw`flex-row`}>
                        <TouchableOpacity onPress={showDatepicker}
                                          style={tw`items-center mr-10 `}>
                            <Text
                                style={tw`text-lg tracking-wide font-normal text-gray-600 mb-2`}>{displayDate}</Text>
                            <Icon style={tw` bg-blue-400 rounded-full p-3`}
                                  name='calendar' size={35}
                                  color='white' type='antdesign'/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showTimepicker}
                                          style={tw`items-center`}>
                            <Text
                                style={tw`text-lg tracking-wide font-normal text-gray-600 mb-2`}>{displayTime}</Text>
                            <View
                                style={tw` bg-blue-400 rounded-full h-16 w-16 items-center justify-center`}>
                                <Ionicons name="alarm-outline" size={35}
                                          color="white"/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={tw`justify-end`}>
                        <TouchableOpacity
                            onPress={editStore}
                            style={tw`flex-row items-center bg-blue-400 px-4 py-3 rounded-full`}>
                            <Text
                                style={tw`text-lg tracking-wide font-semibold text-white  `}>Edit
                                task</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

        </View>
    );
}

export default NewTask;
