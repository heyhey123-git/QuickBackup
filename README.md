# QuickBackup


![Designer](https://github.com/heyhey123-git/QuickBackup/assets/156066831/87242648-35a6-4f0e-9cdd-41150c8fc6e8)

# README.md
- en [English](readme/README.en.md)
- zh_CN [简体中文](README.md)



# QuickBackup

**简介**

本插件运行在使用了 **levilamina/LiteloaderBDS** 的 **BDS服务器** 上。使用本插件可以更好地帮助你对服务器进行安全的热备份，不用担心存档丢失；同时提供了方便的定时执行系统，免去另找其它定时执行工具的麻烦。

**安装**

对于 **levilamina**，你可以直接解压缩本插件的压缩包，然后将其像下图所示，放到插件文件夹中：

```mermaid
flowchart LR
  A(BDS_Server) --> B1(levilamina.dll)
  A --> B2(...)
  A --> B3(plugins)
  B3 --> C(QuickBackup)
  C --> D1(manifest.json)
  C --> D2(index.js)
  C -->  D3(...)
```

对于 **LiteloaderBDS**，你可以将本插件的后缀名改为 `.llplugin`，然后将其直接放入服务器的 `plugins` 文件夹内。做完上面的这一切，可别忘记重启服务器。

**使用**

本插件注册了顶层指令 `/backup` 来方便你快捷地进行或者管理备份任务，以下对命令的用法进行解释。

1. 当你不写任何参数时，使用本命令会立即在你指定的目标文件夹创建一个存档的备份。

2. `/backup [add] <cronExpression: string> <scheduleName: string>`
   - `add`: 枚举项，表示新增一个备份任务
   - `cronExpression`: 任意合法的 cron 表达式，用于指示任务执行时间，到了规定的时间时会自动在你指定的目标文件夹创建一个存档的备份
   - `scheduleName`: 任务的名称，用于区分不同的任务
   - 例：`/backup add "0 0 12 * * ?" test` 表示新增一个名为 "test" 的备份任务，每天 12 点执行一次。启动服务器后会自动在 `schedule.json` 里读取任务列表并载入，不需要在每次进入服务器时都添加任务。

3. `/backup [query|cancel] [actionName: string]`
   - `query`: 枚举项，表示查询任务
   - `cancel`: 枚举项，表示取消任务
   - `actionName`: 表示任务名，指定要操作的任务
   - 当你使用 `query` 来查询任务，但不指定任务名，此时将会返回所有任务。
   - 同理，当你使用 `cancel` 来取消任务，但不指定任务名，此时将会取消所有任务。


