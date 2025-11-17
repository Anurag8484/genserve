from loguru import logger

logger.add('genserve_{time}.log', rotation='10 MB')
