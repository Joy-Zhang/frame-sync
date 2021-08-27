# S2C 帧列表
```json
{
    "type": 1,
    "frames": []
}
```

# C2S 补充帧
```json
{
    "type": 2,
    "id": 0
}
```

# C2S 上行指令
```json
{
    "type": 3,
    "u": 1,
    "cmd": {

    }
}
```

# S2C 帧广播（ACK）
```json
{
    "type": 4,
    "frame": {
        "id": 1,
        "u": 0,
        "t": 123123123
    }
}
```
